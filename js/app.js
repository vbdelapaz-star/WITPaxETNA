/**
 * Main Application Controller & UI Logic
 */
const app = {
    currentStep: 1,

    init() {
        this.renderFormFields();
        this.bindEvents();
        this.updateStorageIndicator();
        this.generateAutoCode();
        this.checkExistingDraft();
        this.renderRecordsTable();
    },

    bindEvents() {
        // Navigation Links
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-target');
                this.navigateTo(target);
            });
        });

        // Step Wizard Buttons
        document.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const step = parseInt(btn.getAttribute('data-step'));
                this.goToStep(step);
            });
        });

        // Step Navigation Controls
        document.getElementById("btnNextStep")?.addEventListener("click", () => this.nextStep());
        document.getElementById("btnPrevStep")?.addEventListener("click", () => this.prevStep());
        document.getElementById("btnDraftSave")?.addEventListener("click", () => this.saveDraft());
        document.getElementById("btnClearForm")?.addEventListener("click", () => this.confirmClearForm());
        document.getElementById("quickResetBtn")?.addEventListener("click", () => this.confirmClearForm());

        // Sidebar Toggle for Mobile
        document.getElementById("sidebarToggle")?.addEventListener("click", () => {
            document.getElementById("appSidebar")?.classList.toggle("show");
        });

        // Form Submit
        document.getElementById("assessmentForm")?.addEventListener("submit", (e) => this.handleFormSubmit(e));

        // Filters in Records Table
        document.getElementById("searchRecordInput")?.addEventListener("input", () => this.filterRecords());
        document.getElementById("filterInstitutionSelect")?.addEventListener("change", () => this.filterRecords());
        document.getElementById("filterRegionSelect")?.addEventListener("change", () => this.filterRecords());
        document.getElementById("btnResetFilters")?.addEventListener("click", () => {
            const search = document.getElementById("searchRecordInput");
            const inst = document.getElementById("filterInstitutionSelect");
            const reg = document.getElementById("filterRegionSelect");
            if (search) search.value = "";
            if (inst) inst.value = "";
            if (reg) reg.value = "";
            this.filterRecords();
        });

        // Delete Selected
        document.getElementById("btnDeleteSelected")?.addEventListener("click", () => this.deleteSelectedRecords());
        document.getElementById("selectAllRecords")?.addEventListener("change", (e) => {
            document.querySelectorAll(".record-checkbox").forEach(cb => cb.checked = e.target.checked);
        });

        // JSON Import
        document.getElementById("jsonImportInput")?.addEventListener("change", (e) => this.handleJSONImport(e));

        // Google Config Save
        document.getElementById("btnSaveGoogleConfig")?.addEventListener("click", () => {
            const client = document.getElementById("googleClientId")?.value || "";
            const sheet = document.getElementById("googleSpreadsheetId")?.value || "";
            if (typeof storage !== 'undefined') {
                storage.saveSettings({ googleClientId: client, googleSpreadsheetId: sheet });
                alert("Google API configuration saved locally.");
            }
        });
    },

    navigateTo(viewId) {
        document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => link.classList.remove('active'));

        const targetView = document.getElementById(viewId);
        if (targetView) targetView.classList.add('active');

        const activeLink = document.querySelector(`.sidebar-nav .nav-link[data-target="${viewId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Dynamic View Triggers
        if (viewId === 'view-analytics' && typeof analytics !== 'undefined' && typeof storage !== 'undefined') {
            analytics.renderDashboard(storage.getAllRecords());
        } else if (viewId === 'view-report' && typeof report !== 'undefined') {
            report.generateReportHTML();
        } else if (viewId === 'view-forum-summary') {
            this.renderForumSummary();
        } else if (viewId === 'view-records') {
            this.renderRecordsTable();
        }

        // Close sidebar on mobile
        document.getElementById("appSidebar")?.classList.remove("show");
    },

    renderFormFields() {
        if (typeof FORM_SCHEMA === 'undefined') return;

        // Populate Select Options
        this.populateSelect("position", FORM_SCHEMA.positionOptions);
        this.populateSelect("highestQualification", FORM_SCHEMA.highestQualificationOptions);
        this.populateSelect("yearsTVET", FORM_SCHEMA.yearsTVETOptions);
        this.populateSelect("yearsWeldingTeaching", FORM_SCHEMA.yearsWeldingTeachingOptions);
        this.populateSelect("classSize", FORM_SCHEMA.classSizeOptions);
        this.populateSelect("skillLevel", FORM_SCHEMA.skillLevelOptions);
        this.populateSelect("simulatorType", FORM_SCHEMA.simulatorTypeOptions);
        this.populateSelect("seaberyExperience", FORM_SCHEMA.seaberyExperienceOptions);

        // Populate Checkboxes
        this.renderCheckboxes("qualificationsHeldContainer", FORM_SCHEMA.qualificationsHeldOptions, "qualificationsHeld");
        this.renderCheckboxes("programsTaughtContainer", FORM_SCHEMA.programsTaughtOptions, "programsTaught");
        this.renderCheckboxes("challengesContainer", FORM_SCHEMA.challengesOptions, "challenges", (e) => this.enforceChallengeLimit(e));
        this.renderCheckboxes("processes12mContainer", FORM_SCHEMA.processes12mOptions, "processes12m");
        this.renderCheckboxes("processesTeachContainer", FORM_SCHEMA.processesTeachOptions, "processesTeach");
        this.renderCheckboxes("simulatorConcernsContainer", FORM_SCHEMA.simulatorConcernsOptions, "simulatorConcerns");
        this.renderCheckboxes("teachingApproachesContainer", FORM_SCHEMA.teachingApproachesOptions, "teachingApproaches");
        this.renderCheckboxes("assessmentMethodsContainer", FORM_SCHEMA.assessmentMethodsOptions, "assessmentMethods");
        this.renderCheckboxes("assessmentDifficultiesContainer", FORM_SCHEMA.assessmentDifficultiesOptions, "assessmentDifficulties");
        this.renderCheckboxes("curriculumOutputsContainer", FORM_SCHEMA.curriculumOutputsOptions, "curriculumOutputs");
        this.renderCheckboxes("barriersContainer", FORM_SCHEMA.barriersOptions, "barriers");
        this.renderCheckboxes("supportNeedsContainer", FORM_SCHEMA.supportNeedsOptions, "supportNeeds");

        // Render Rating Matrices
        this.renderRatingMatrix("technicalMatrixBody", FORM_SCHEMA.technicalMatrixRows, "techMatrix");
        this.renderRatingMatrix("simulatorMatrixBody", FORM_SCHEMA.simulatorMatrixRows, "simMatrix");
        this.renderRatingMatrix("instructionalMatrixBody", FORM_SCHEMA.instructionalMatrixRows, "instMatrix");

        // Render Priority Gap Dual Matrix (Part VII)
        this.renderLearningNeedsMatrix();

        // Render Baseline Questions
        this.renderBaselineQuestions();
    },

    populateSelect(id, options) {
        const el = document.getElementById(id);
        if (!el || !options) return;
        el.innerHTML = `<option value="">-- Select Option --</option>` + 
            options.map(o => `<option value="${o}">${o}</option>`).join('');
    },

    renderCheckboxes(containerId, options, name, changeHandler = null) {
        const container = document.getElementById(containerId);
        if (!container || !options) return;
        container.innerHTML = options.map((o, idx) => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="${name}" value="${o}" id="${name}_${idx}">
                <label class="form-check-label small" for="${name}_${idx}">${o}</label>
            </div>
        `).join('');

        if (changeHandler) {
            container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.addEventListener('change', changeHandler);
            });
        }
    },

    enforceChallengeLimit(e) {
        const checked = document.querySelectorAll('input[name="challenges"]:checked');
        const badge = document.getElementById("challengeCountBadge");
        if (badge) badge.textContent = `${checked.length} / 5 selected`;
        if (checked.length > 5) {
            e.target.checked = false;
            alert("You may select up to a maximum of 5 learner challenges.");
            const reChecked = document.querySelectorAll('input[name="challenges"]:checked');
            if (badge) badge.textContent = `${reChecked.length} / 5 selected`;
        }
    },

    renderRatingMatrix(tbodyId, rows, groupPrefix) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody || !rows) return;
        tbody.innerHTML = rows.map(r => `
            <tr>
                <td class="fw-semibold small">${r.label}</td>
                ${[1,2,3,4,5].map(val => `
                    <td class="text-center">
                        <input type="radio" name="${groupPrefix}_${r.id}" value="${val}">
                    </td>
                `).join('')}
            </tr>
        `).join('');
    },

    renderLearningNeedsMatrix() {
        const tbody = document.getElementById("learningNeedsBody");
        if (!tbody || typeof FORM_SCHEMA === 'undefined') return;

        tbody.innerHTML = FORM_SCHEMA.learningTopics.map(t => `
            <tr>
                <td class="text-start fw-semibold small">${t.label}</td>
                <td>
                    <select class="form-select form-select-sm gap-ability" data-topic="${t.id}">
                        <option value="">--</option>
                        ${[1,2,3,4,5].map(v => `<option value="${v}">${v}</option>`).join('')}
                    </select>
                </td>
                <td>
                    <select class="form-select form-select-sm gap-importance" data-topic="${t.id}">
                        <option value="">--</option>
                        ${[1,2,3,4,5].map(v => `<option value="${v}">${v}</option>`).join('')}
                    </select>
                </td>
                <td><strong class="gap-display text-primary" id="gap_display_${t.id}">0</strong></td>
                <td><span class="badge bg-secondary gap-badge" id="gap_badge_${t.id}">No Gap</span></td>
            </tr>
        `).join('');

        tbody.querySelectorAll('select').forEach(sel => {
            sel.addEventListener('change', () => this.updatePriorityGap(sel.getAttribute('data-topic')));
        });
    },

    updatePriorityGap(topicId) {
        const abilityEl = document.querySelector(`.gap-ability[data-topic="${topicId}"]`);
        const importanceEl = document.querySelector(`.gap-importance[data-topic="${topicId}"]`);
        const displayEl = document.getElementById(`gap_display_${topicId}`);
        const badgeEl = document.getElementById(`gap_badge_${topicId}`);

        if (!abilityEl || !importanceEl || !displayEl || !badgeEl) return;

        const cur = Number(abilityEl.value);
        const imp = Number(importanceEl.value);

        if (cur && imp) {
            const gap = imp - cur;
            displayEl.textContent = gap > 0 ? `+${gap}` : gap;
            
            const band = (typeof analytics !== 'undefined') ? analytics.getPriorityGapBand(gap) : `Gap: ${gap}`;
            badgeEl.textContent = band;
            
            if (gap >= 3) badgeEl.className = "badge bg-danger";
            else if (gap >= 2) badgeEl.className = "badge bg-warning text-dark";
            else if (gap >= 1) badgeEl.className = "badge bg-info text-dark";
            else badgeEl.className = "badge bg-secondary";
        } else {
            displayEl.textContent = "0";
            badgeEl.textContent = "No Gap";
            badgeEl.className = "badge bg-secondary";
        }
    },

    renderBaselineQuestions() {
        const container = document.getElementById("baselineQuestionsContainer");
        if (!container || typeof FORM_SCHEMA === 'undefined') return;

        container.innerHTML = FORM_SCHEMA.baselineQuestions.map((q, idx) => `
            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">
                    <p class="fw-bold text-navy mb-2">${q.text}</p>
                    <div class="d-flex flex-column gap-2">
                        ${q.options.map(opt => `
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="${q.id}" value="${opt.key}" id="${q.id}_${opt.key}">
                                <label class="form-check-label small" for="${q.id}_${opt.key}">
                                    <strong>${opt.key}.</strong>${opt.text}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    },

    generateAutoCode() {
        if (typeof storage === 'undefined') return;
        const records = storage.getAllRecords();
        const nextNum = records.length + 1;
        const code = `WELD-${String(nextNum).padStart(4, '0')}`;
        const input = document.getElementById("participantCode");
        if (input) input.value = code;
    },

    goToStep(stepNumber) {
        // Validate preceding step before jumping forward
        if (stepNumber > this.currentStep) {
            const formData = this.getFormData();
            const errors = validation.validatePart(this.currentStep, formData);
            if (errors.length > 0) {
                alert("Please complete required fields before proceeding:\n- " + errors.join("\n- "));
                return;
            }
        }

        this.currentStep = stepNumber;
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${stepNumber}"]`)?.classList.add('active');

        document.querySelectorAll('.step-btn').forEach(btn => {
            const s = parseInt(btn.getAttribute('data-step'));
            btn.classList.remove('active');
            if (s === stepNumber) btn.classList.add('active');
            if (s < stepNumber) btn.classList.add('completed');
        });

        // Button states
        const btnPrev = document.getElementById("btnPrevStep");
        const btnNext = document.getElementById("btnNextStep");
        const btnSubmit = document.getElementById("btnSubmitForm");

        if (btnPrev) btnPrev.disabled = (stepNumber === 1);
        if (stepNumber === 8) {
            if (btnNext) btnNext.classList.add("d-none");
            if (btnSubmit) btnSubmit.classList.remove("d-none");
        } else {
            if (btnNext) btnNext.classList.remove("d-none");
            if (btnSubmit) btnSubmit.classList.add("d-none");
        }

        const titles = [
            "Part I: Participant Profile & Information",
            "Part II: Current Teaching Assignment",
            "Part III: Experience with Welding Equipment & Processes",
            "Part IV: Experience with Simulation & Digital Technology",
            "Part V: Instructional & Curriculum Needs",
            "Part VI: Open Forum Participant Expectations",
            "Part VII: Self-Assessment of Learning Needs & Priority Gaps",
            "Part VIII: Short Baseline Knowledge Check"
        ];
        const titleEl = document.getElementById("currentStepTitle");
        if (titleEl) titleEl.textContent = titles[stepNumber - 1];
        
        const pct = validation.calculateCompletionPercentage(this.getFormData());
        const badge = document.getElementById("completionPercentageBadge");
        const bar = document.getElementById("formProgressBar");
        if (badge) badge.textContent = `${pct}% Completed`;
        if (bar) bar.style.width = `${pct}%`;
    },

    nextStep() {
        if (this.currentStep < 8) this.goToStep(this.currentStep + 1);
    },

    prevStep() {
        if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
    },

    getFormData() {
        const getChecked = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(c => c.value);
        const getRadio = (name) => {
            const checked = document.querySelector(`input[name="${name}"]:checked`);
            return checked ? Number(checked.value) : null;
        };
        const getVal = (id) => document.getElementById(id)?.value || "";

        const techMatrix = {};
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.technicalMatrixRows) {
            FORM_SCHEMA.technicalMatrixRows.forEach(r => {
                techMatrix[r.id] = getRadio(`techMatrix_${r.id}`);
            });
        }

        const simMatrix = {};
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.simulatorMatrixRows) {
            FORM_SCHEMA.simulatorMatrixRows.forEach(r => {
                simMatrix[r.id] = getRadio(`simMatrix_${r.id}`);
            });
        }

        const instMatrix = {};
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.instructionalMatrixRows) {
            FORM_SCHEMA.instructionalMatrixRows.forEach(r => {
                instMatrix[r.id] = getRadio(`instMatrix_${r.id}`);
            });
        }

        const learningNeeds = {};
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.learningTopics) {
            FORM_SCHEMA.learningTopics.forEach(t => {
                const ab = document.querySelector(`.gap-ability[data-topic="${t.id}"]`)?.value;
                const imp = document.querySelector(`.gap-importance[data-topic="${t.id}"]`)?.value;
                learningNeeds[t.id] = {
                    ability: ab ? Number(ab) : null,
                    importance: imp ? Number(imp) : null
                };
            });
        }

        const baselineAnswers = {};
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.baselineQuestions) {
            FORM_SCHEMA.baselineQuestions.forEach(q => {
                const checked = document.querySelector(`input[name="${q.id}"]:checked`);
                baselineAnswers[q.id] = checked ? checked.value : null;
            });
        }

        return {
            participantCode: getVal("participantCode"),
            fullName: getVal("fullName"),
            institution: getVal("institution"),
            region: getVal("region"),
            position: getVal("position"),
            highestQualification: getVal("highestQualification"),
            yearsTVET: getVal("yearsTVET"),
            yearsWeldingTeaching: getVal("yearsWeldingTeaching"),
            qualificationsHeld: getChecked("qualificationsHeld"),
            programsTaught: getChecked("programsTaught"),
            classSize: getVal("classSize"),
            skillLevel: getVal("skillLevel"),
            challenges: getChecked("challenges"),
            compImprove1: getVal("compImprove1"),
            compImprove2: getVal("compImprove2"),
            compImprove3: getVal("compImprove3"),
            technicalMatrix: techMatrix,
            processes12m: getChecked("processes12m"),
            processesTeach: getChecked("processesTeach"),
            technicalTopicsToStrengthen: getVal("technicalTopicsToStrengthen"),
            usedSimulator: getVal("usedSimulator"),
            simulatorType: getVal("simulatorType"),
            seaberyExperience: getVal("seaberyExperience"),
            simulatorMatrix: simMatrix,
            concerns: getChecked("simulatorConcerns"),
            functionsToPractice: getVal("simulatorFunctionsToPractice"),
            instructionalMatrix: instMatrix,
            teachingApproaches: getChecked("teachingApproaches"),
            assessmentMethods: getChecked("assessmentMethods"),
            assessmentDifficulties: getChecked("assessmentDifficulties"),
            curriculumOutputs: getChecked("curriculumOutputs"),
            expLearn: getVal("expLearn"),
            expAcquire: getVal("expAcquire"),
            expQuestions: getVal("expQuestions"),
            expPriorities: getVal("expPriorities"),
            expOutcomes: getVal("expOutcomes"),
            barriers: getChecked("barriers"),
            supportNeeds: getChecked("supportNeeds"),
            priorityExp1: getVal("priorityExp1"),
            priorityExp2: getVal("priorityExp2"),
            priorityExp3: getVal("priorityExp3"),
            learningNeeds,
            baselineAnswers,
            consent: document.getElementById("consentCheckbox")?.checked || false
        };
    },

    handleFormSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData();

        // Perform full validation check across all steps
        const errors = validation.validateAll(formData);
        if (errors.length > 0) {
            alert("Validation errors before submission:\n\n" + errors.join("\n"));
            return;
        }

        // Compute Scores
        let baselineScore = 0;
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.baselineQuestions) {
            FORM_SCHEMA.baselineQuestions.forEach(q => {
                if (formData.baselineAnswers[q.id] === q.correct) baselineScore++;
            });
        }
        const baselinePercentage = Math.round((baselineScore / 10) * 100);
        let baselineCategory = "Requires Foundational Support";
        if (baselinePercentage >= 80) baselineCategory = "Strong Baseline Knowledge";
        else if (baselinePercentage >= 60) baselineCategory = "Moderate Baseline Knowledge";

        // Compute Priority Gaps
        const priorityGaps = (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.learningTopics) ? 
            FORM_SCHEMA.learningTopics.map(t => {
                const ab = formData.learningNeeds[t.id]?.ability || 0;
                const imp = formData.learningNeeds[t.id]?.importance || 0;
                return {
                    topicId: t.id,
                    label: t.label,
                    ability: ab,
                    importance: imp,
                    gap: imp - ab
                };
            }) : [];

        const techVals = Object.values(formData.technicalMatrix).filter(Boolean);
        const simVals = Object.values(formData.simulatorMatrix).filter(Boolean);
        const instVals = Object.values(formData.instructionalMatrix).filter(Boolean);
        const gapVals = priorityGaps.map(g => g.gap);

        const calcMean = (arr) => (typeof analytics !== 'undefined') ? analytics.calculateMean(arr) : (arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : 0);

        const record = {
            recordId: "REC_" + Date.now(),
            participantCode: formData.participantCode,
            submissionDate: new Date().toISOString(),
            participantInformation: {
                fullName: formData.fullName || "Anonymous Participant",
                institution: formData.institution,
                region: formData.region,
                position: formData.position,
                highestQualification: formData.highestQualification,
                yearsTVET: formData.yearsTVET,
                yearsWeldingTeaching: formData.yearsWeldingTeaching,
                qualificationsHeld: formData.qualificationsHeld
            },
            currentTeachingAssignment: {
                programsTaught: formData.programsTaught,
                classSize: formData.classSize,
                skillLevel: formData.skillLevel,
                challenges: formData.challenges,
                compImprove1: formData.compImprove1,
                compImprove2: formData.compImprove2,
                compImprove3: formData.compImprove3
            },
            technicalExperience: {
                matrix: formData.technicalMatrix,
                processes12m: formData.processes12m,
                processesTeach: formData.processesTeach,
                technicalTopicsToStrengthen: formData.technicalTopicsToStrengthen
            },
            simulatorExperience: {
                usedSimulator: formData.usedSimulator,
                simulatorType: formData.simulatorType,
                seaberyExperience: formData.seaberyExperience,
                matrix: formData.simulatorMatrix,
                concerns: formData.concerns,
                functionsToPractice: formData.functionsToPractice
            },
            instructionalNeeds: {
                matrix: formData.instructionalMatrix,
                teachingApproaches: formData.teachingApproaches,
                assessmentMethods: formData.assessmentMethods,
                assessmentDifficulties: formData.assessmentDifficulties,
                curriculumOutputs: formData.curriculumOutputs
            },
            openForumExpectations: {
                expLearn: formData.expLearn,
                expAcquire: formData.expAcquire,
                expQuestions: formData.expQuestions,
                expPriorities: formData.expPriorities,
                expOutcomes: formData.expOutcomes,
                barriers: formData.barriers,
                supportNeeds: formData.supportNeeds,
                priorityExp1: formData.priorityExp1,
                priorityExp2: formData.priorityExp2,
                priorityExp3: formData.priorityExp3
            },
            learningNeeds: formData.learningNeeds,
            priorityGaps: priorityGaps,
            computedScores: {
                baselineScore,
                baselinePercentage,
                baselineCategory,
                avgTechConfidence: calcMean(techVals),
                avgSimConfidence: calcMean(simVals),
                avgInstConfidence: calcMean(instVals),
                avgPriorityGap: calcMean(gapVals)
            }
        };

        if (typeof storage !== 'undefined' && storage.saveCompletedRecord(record)) {
            alert("Assessment submitted and saved successfully!");
            this.updateStorageIndicator();
            this.navigateTo("view-records");
        } else {
            alert("Failed to save record to local storage.");
        }
    },

    saveDraft() {
        const data = this.getFormData();
        if (typeof storage !== 'undefined' && storage.saveDraft(data)) {
            const badge = document.getElementById("draftStatusBadge");
            if (badge) badge.innerHTML = `<i class="bi bi-check-circle me-1"></i> Draft Saved (${new Date().toLocaleTimeString()})`;
            alert("Assessment draft saved locally.");
        }
    },

    checkExistingDraft() {
        if (typeof storage === 'undefined') return;
        const draft = storage.loadDraft();
        if (draft) {
            if (confirm(`A saved draft from ${new Date(draft.updatedAt).toLocaleString()} was found. Restore draft?`)) {
                this.populateFormWithData(draft.formData);
            }
        }
    },

    populateFormWithData(d) {
        if (!d) return;

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || "";
        };

        const setCheckboxes = (name, vals) => {
            if (!Array.isArray(vals)) return;
            document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
                cb.checked = vals.includes(cb.value);
            });
        };

        const setRadio = (name, val) => {
            if (val === null || val === undefined) return;
            const radio = document.querySelector(`input[name="${name}"][value="${val}"]`);
            if (radio) radio.checked = true;
        };

        // Text & Select fields
        setVal("participantCode", d.participantCode);
        setVal("fullName", d.fullName);
        setVal("institution", d.institution);
        setVal("region", d.region);
        setVal("position", d.position);
        setVal("highestQualification", d.highestQualification);
        setVal("yearsTVET", d.yearsTVET);
        setVal("yearsWeldingTeaching", d.yearsWeldingTeaching);
        setVal("classSize", d.classSize);
        setVal("skillLevel", d.skillLevel);
        setVal("compImprove1", d.compImprove1);
        setVal("compImprove2", d.compImprove2);
        setVal("compImprove3", d.compImprove3);
        setVal("technicalTopicsToStrengthen", d.technicalTopicsToStrengthen);
        setVal("usedSimulator", d.usedSimulator);
        setVal("simulatorType", d.simulatorType);
        setVal("seaberyExperience", d.seaberyExperience);
        setVal("simulatorFunctionsToPractice", d.simulatorFunctionsToPractice);
        setVal("expLearn", d.expLearn);
        setVal("expAcquire", d.expAcquire);
        setVal("expQuestions", d.expQuestions);
        setVal("expPriorities", d.expPriorities);
        setVal("expOutcomes", d.expOutcomes);
        setVal("priorityExp1", d.priorityExp1);
        setVal("priorityExp2", d.priorityExp2);
        setVal("priorityExp3", d.priorityExp3);

        // Checkboxes
        setCheckboxes("qualificationsHeld", d.qualificationsHeld);
        setCheckboxes("programsTaught", d.programsTaught);
        setCheckboxes("challenges", d.challenges);
        setCheckboxes("processes12m", d.processes12m);
        setCheckboxes("processesTeach", d.processesTeach);
        setCheckboxes("simulatorConcerns", d.concerns);
        setCheckboxes("teachingApproaches", d.teachingApproaches);
        setCheckboxes("assessmentMethods", d.assessmentMethods);
        setCheckboxes("assessmentDifficulties", d.assessmentDifficulties);
        setCheckboxes("curriculumOutputs", d.curriculumOutputs);
        setCheckboxes("barriers", d.barriers);
        setCheckboxes("supportNeeds", d.supportNeeds);

        // Matrices
        if (d.technicalMatrix) {
            Object.keys(d.technicalMatrix).forEach(key => setRadio(`techMatrix_${key}`, d.technicalMatrix[key]));
        }
        if (d.simulatorMatrix) {
            Object.keys(d.simulatorMatrix).forEach(key => setRadio(`simMatrix_${key}`, d.simulatorMatrix[key]));
        }
        if (d.instructionalMatrix) {
            Object.keys(d.instructionalMatrix).forEach(key => setRadio(`instMatrix_${key}`, d.instructionalMatrix[key]));
        }

        // Priority Gap Dropdowns
        if (d.learningNeeds) {
            Object.keys(d.learningNeeds).forEach(topicId => {
                const ab = d.learningNeeds[topicId]?.ability;
                const imp = d.learningNeeds[topicId]?.importance;
                const abEl = document.querySelector(`.gap-ability[data-topic="${topicId}"]`);
                const impEl = document.querySelector(`.gap-importance[data-topic="${topicId}"]`);
                if (abEl) abEl.value = ab || "";
                if (impEl) impEl.value = imp || "";
                this.updatePriorityGap(topicId);
            });
        }

        // Baseline Answers & Consent
        if (d.baselineAnswers) {
            Object.keys(d.baselineAnswers).forEach(qId => setRadio(qId, d.baselineAnswers[qId]));
        }
        const consentEl = document.getElementById("consentCheckbox");
        if (consentEl) consentEl.checked = !!d.consent;

        // Recalculate progress
        const pct = validation.calculateCompletionPercentage(this.getFormData());
        const badge = document.getElementById("completionPercentageBadge");
        const bar = document.getElementById("formProgressBar");
        if (badge) badge.textContent = `${pct}% Completed`;
        if (bar) bar.style.width = `${pct}%`;
    },

    confirmClearForm() {
        if (confirm("Are you sure you want to clear all entered form data? This cannot be undone.")) {
            document.getElementById("assessmentForm")?.reset();
            this.generateAutoCode();
            this.goToStep(1);
        }
    },

    renderRecordsTable() {
        if (typeof storage === 'undefined') return;
        const records = storage.getAllRecords();
        const tbody = document.getElementById("recordsTableBody");
        if (!tbody) return;

        if (records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" class="text-center text-muted p-4">No assessment records found. Complete an assessment to see records here.</td></tr>`;
            return;
        }

        tbody.innerHTML = records.map(r => `
            <tr>
                <td><input type="checkbox" class="record-checkbox" value="${r.recordId}"></td>
                <td><strong>${r.participantCode}</strong></td>
                <td>${r.participantInformation.fullName}</td>
                <td>${r.participantInformation.institution}</td>
                <td>${new Date(r.submissionDate).toLocaleDateString()}</td>
                <td><span class="badge ${r.computedScores.baselinePercentage >= 80 ? 'bg-success' : 'bg-warning'}">${r.computedScores.baselinePercentage}%</span></td>
                <td>${r.computedScores.avgTechConfidence}</td>
                <td>${r.computedScores.avgSimConfidence}</td>
                <td>${r.computedScores.avgInstConfidence}</td>
                <td><span class="badge bg-danger">${r.computedScores.avgPriorityGap}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="app.viewRecordDetails('${r.recordId}')"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.deleteSingleRecord('${r.recordId}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');

        const insts = [...new Set(records.map(r => r.participantInformation.institution))];
        const regs = [...new Set(records.map(r => r.participantInformation.region))];

        const filterInst = document.getElementById("filterInstitutionSelect");
        const filterReg = document.getElementById("filterRegionSelect");

        if (filterInst) filterInst.innerHTML = `<option value="">All Institutions</option>` + insts.map(i => `<option value="${i}">${i}</option>`).join('');
        if (filterReg) filterReg.innerHTML = `<option value="">All Regions</option>` + regs.map(r => `<option value="${r}">${r}</option>`).join('');
    },

    filterRecords() {
        if (typeof storage === 'undefined') return;
        const search = document.getElementById("searchRecordInput")?.value.toLowerCase() || "";
        const inst = document.getElementById("filterInstitutionSelect")?.value || "";
        const reg = document.getElementById("filterRegionSelect")?.value || "";

        let records = storage.getAllRecords();
        records = records.filter(r => {
            const matchesSearch = r.participantCode.toLowerCase().includes(search) ||
                r.participantInformation.fullName.toLowerCase().includes(search) ||
                r.participantInformation.institution.toLowerCase().includes(search);
            const matchesInst = inst === "" || r.participantInformation.institution === inst;
            const matchesReg = reg === "" || r.participantInformation.region === reg;
            return matchesSearch && matchesInst && matchesReg;
        });

        const tbody = document.getElementById("recordsTableBody");
        if (!tbody) return;

        tbody.innerHTML = records.map(r => `
            <tr>
                <td><input type="checkbox" class="record-checkbox" value="${r.recordId}"></td>
                <td><strong>${r.participantCode}</strong></td>
                <td>${r.participantInformation.fullName}</td>
                <td>${r.participantInformation.institution}</td>
                <td>${new Date(r.submissionDate).toLocaleDateString()}</td>
                <td><span class="badge bg-success">${r.computedScores.baselinePercentage}%</span></td>
                <td>${r.computedScores.avgTechConfidence}</td>
                <td>${r.computedScores.avgSimConfidence}</td>
                <td>${r.computedScores.avgInstConfidence}</td>
                <td><span class="badge bg-danger">${r.computedScores.avgPriorityGap}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="app.viewRecordDetails('${r.recordId}')"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.deleteSingleRecord('${r.recordId}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    viewRecordDetails(recordId) {
        if (typeof storage === 'undefined') return;
        const record = storage.getRecordById(recordId);
        if (!record) return;

        const body = document.getElementById("viewRecordModalBody");
        if (!body) return;

        body.innerHTML = `
            <h6><strong>Code:</strong> ${record.participantCode}</h6>
            <h6><strong>Name:</strong> ${record.participantInformation.fullName}</h6>
            <h6><strong>Institution:</strong> ${record.participantInformation.institution}</h6>
            <hr>
            <p><strong>Baseline Knowledge Score:</strong> ${record.computedScores.baselinePercentage}% (${record.computedScores.baselineCategory})</p>
            <p><strong>Top Priority Expectations:</strong> ${record.openForumExpectations.priorityExp1 || "N/A"}</p>
        `;

        const modalEl = document.getElementById("viewRecordModal");
        if (modalEl && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }
    },

    deleteSingleRecord(recordId) {
        if (typeof storage === 'undefined') return;
        if (confirm("Are you sure you want to delete this record?")) {
            storage.deleteRecord(recordId);
            this.renderRecordsTable();
            this.updateStorageIndicator();
        }
    },

    deleteSelectedRecords() {
        if (typeof storage === 'undefined') return;
        const selected = Array.from(document.querySelectorAll(".record-checkbox:checked")).map(cb => cb.value);
        if (selected.length === 0) {
            alert("No records selected.");
            return;
        }
        if (confirm(`Delete ${selected.length} selected record(s)?`)) {
            storage.deleteSelectedRecords(selected);
            this.renderRecordsTable();
            this.updateStorageIndicator();
        }
    },

    renderForumSummary() {
        if (typeof storage === 'undefined') return;
        const records = storage.getAllRecords();
        const container = document.getElementById("forumSummaryContainer");
        if (!container) return;

        if (records.length === 0) {
            container.innerHTML = `<div class="col-12"><div class="alert alert-info">No participant expectations recorded yet.</div></div>`;
            return;
        }

        container.innerHTML = `
            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-navy text-white fw-bold">Expectations to Learn</div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush small">
                            ${records.map(r => r.openForumExpectations.expLearn ? `<li class="list-group-item">"${r.openForumExpectations.expLearn}" <br><small class="text-muted">- ${r.participantCode}</small></li>` : '').join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-navy text-white fw-bold">Key Facilitator Questions</div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush small">
                            ${records.map(r => r.openForumExpectations.expQuestions ? `<li class="list-group-item">"${r.openForumExpectations.expQuestions}" <br><small class="text-muted">- ${r.participantCode}</small></li>` : '').join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    updateStorageIndicator() {
        if (typeof storage === 'undefined') return;
        const records = storage.getAllRecords();
        const countText = document.getElementById("recordCountText");
        const progressBar = document.getElementById("storageProgressBar");

        if (countText) countText.textContent = `${records.length} record(s) stored locally`;
        if (progressBar) {
            const pct = Math.min(100, (records.length / 500) * 100);
            progressBar.style.width = `${pct}%`;
        }
    },

    handleJSONImport(e) {
        if (typeof storage === 'undefined') return;
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const res = storage.importBackupJSON(evt.target.result);
            if (res.success) {
                alert(`Successfully restored ${res.count} records from backup!`);
                this.renderRecordsTable();
                this.updateStorageIndicator();
            } else {
                alert(`Import failed: ${res.error}`);
            }
        };
        reader.readAsText(file);
    },

    confirmClearAllData() {
        if (typeof storage === 'undefined') return;
        if (confirm("CRITICAL WARNING: This will permanently erase ALL participant records from your browser. Are you absolutely sure?")) {
            storage.clearAllRecords();
            this.renderRecordsTable();
            this.updateStorageIndicator();
            alert("All local assessment data has been wiped.");
        }
    }
};

// Application Initialize Entry Point
document.addEventListener("DOMContentLoaded", () => {
    app.init();
});
