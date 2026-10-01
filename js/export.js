/**
 * Excel, CSV, and JSON Export Functions using SheetJS
 */
const exportData = {
    toXLSX() {
        const records = storage.getAllRecords();
        if (records.length === 0) {
            alert("No records available to export.");
            return;
        }

        const wb = XLSX.utils.book_new();

        // Sheet 1: Participant Information
        const pInfo = records.map(r => ({
            "Participant Code": r.participantCode,
            "Name": r.participantInformation.fullName,
            "Institution": r.participantInformation.institution,
            "Region": r.participantInformation.region,
            "Position": r.participantInformation.position,
            "Years in TVET": r.participantInformation.yearsTVET,
            "Years Teaching Welding": r.participantInformation.yearsWeldingTeaching,
            "Qualifications Held": (r.participantInformation.qualificationsHeld || []).join("; "),
            "Highest Qualification": r.participantInformation.highestQualification,
            "Submission Date": r.submissionDate
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pInfo), "Participant Info");

        // Sheet 2: Teaching Assignment
        const tAssign = records.map(r => ({
            "Participant Code": r.participantCode,
            "Programs Taught": (r.currentTeachingAssignment.programsTaught || []).join("; "),
            "Class Size": r.currentTeachingAssignment.classSize,
            "Learner Skill Level": r.currentTeachingAssignment.skillLevel,
            "Common Challenges": (r.currentTeachingAssignment.challenges || []).join("; "),
            "Improvement Competency 1": r.currentTeachingAssignment.compImprove1,
            "Improvement Competency 2": r.currentTeachingAssignment.compImprove2,
            "Improvement Competency 3": r.currentTeachingAssignment.compImprove3
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tAssign), "Teaching Assignment");

        // Sheet 3: Technical Experience
        const techExp = records.map(r => {
            const row = { "Participant Code": r.participantCode };
            FORM_SCHEMA.technicalMatrixRows.forEach(m => {
                row[m.label] = r.technicalExperience.matrix[m.id] || "";
            });
            row["Processes 12 Months"] = (r.technicalExperience.processes12m || []).join("; ");
            row["Processes Taught"] = (r.technicalExperience.processesTeach || []).join("; ");
            row["Topics to Strengthen"] = r.technicalExperience.technicalTopicsToStrengthen || "";
            return row;
        });
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(techExp), "Technical Experience");

        // Sheet 4: Simulator Experience
        const simExp = records.map(r => {
            const row = {
                "Participant Code": r.participantCode,
                "Used Simulator": r.simulatorExperience.usedSimulator,
                "Simulator Type": r.simulatorExperience.simulatorType,
                "SEABERY Experience": r.simulatorExperience.seaberyExperience
            };
            FORM_SCHEMA.simulatorMatrixRows.forEach(m => {
                row[m.label] = r.simulatorExperience.matrix[m.id] || "";
            });
            row["Concerns"] = (r.simulatorExperience.concerns || []).join("; ");
            row["Functions to Practice"] = r.simulatorExperience.functionsToPractice || "";
            return row;
        });
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(simExp), "Simulator Experience");

        // Sheet 5: Instructional Needs
        const instNeeds = records.map(r => {
            const row = { "Participant Code": r.participantCode };
            FORM_SCHEMA.instructionalMatrixRows.forEach(m => {
                row[m.label] = r.instructionalNeeds.matrix[m.id] || "";
            });
            row["Teaching Approaches"] = (r.instructionalNeeds.teachingApproaches || []).join("; ");
            row["Assessment Methods"] = (r.instructionalNeeds.assessmentMethods || []).join("; ");
            row["Assessment Difficulties"] = (r.instructionalNeeds.assessmentDifficulties || []).join("; ");
            row["Curriculum Outputs"] = (r.instructionalNeeds.curriculumOutputs || []).join("; ");
            return row;
        });
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(instNeeds), "Instructional Needs");

        // Sheet 6: Open Forum Expectations
        const openForum = records.map(r => ({
            "Participant Code": r.participantCode,
            "Expectation: Learn": r.openForumExpectations.expLearn,
            "Expectation: Acquire": r.openForumExpectations.expAcquire,
            "Expectation: Questions": r.openForumExpectations.expQuestions,
            "Expectation: Priorities": r.openForumExpectations.expPriorities,
            "Expectation: Outcomes": r.openForumExpectations.expOutcomes,
            "Barriers": (r.openForumExpectations.barriers || []).join("; "),
            "Support Needs": (r.openForumExpectations.supportNeeds || []).join("; "),
            "Priority 1": r.openForumExpectations.priorityExp1,
            "Priority 2": r.openForumExpectations.priorityExp2,
            "Priority 3": r.openForumExpectations.priorityExp3
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(openForum), "Open Forum");

        // Sheet 7: Priority Gaps
        const pGaps = records.map(r => {
            const row = { "Participant Code": r.participantCode };
            (r.priorityGaps || []).forEach(g => {
                row[`${g.label} (Gap)`] = g.gap;
            });
            return row;
        });
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pGaps), "Priority Gaps");

        // Sheet 8: Baseline Knowledge
        const baseline = records.map(r => ({
            "Participant Code": r.participantCode,
            "Score (Out of 10)": r.computedScores.baselineScore,
            "Percentage": `${r.computedScores.baselinePercentage}%`,
            "Performance Category": r.computedScores.baselineCategory
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(baseline), "Baseline Knowledge");

        // Write Workbook
        XLSX.writeFile(wb, `SEABERY_Assessment_Export_${new Date().toISOString().slice(0,10)}.xlsx`);
    },

    toCSV() {
        const records = storage.getAllRecords();
        if (records.length === 0) {
            alert("No records to export.");
            return;
        }

        const flatData = records.map(r => ({
            ParticipantCode: r.participantCode,
            Name: r.participantInformation.fullName,
            Institution: r.participantInformation.institution,
            Region: r.participantInformation.region,
            Position: r.participantInformation.position,
            YearsTVET: r.participantInformation.yearsTVET,
            YearsTeaching: r.participantInformation.yearsWeldingTeaching,
            BaselineScore: r.computedScores.baselineScore,
            BaselinePercentage: r.computedScores.baselinePercentage,
            MeanTechConfidence: r.computedScores.avgTechConfidence,
            MeanSimConfidence: r.computedScores.avgSimConfidence,
            MeanInstConfidence: r.computedScores.avgInstConfidence,
            MeanPriorityGap: r.computedScores.avgPriorityGap,
            SubmissionDate: r.submissionDate
        }));

        const ws = XLSX.utils.json_to_sheet(flatData);
        const csv = XLSX.utils.sheet_to_csv(ws);
        
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SEABERY_Assessment_Records_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },

    toLongFormatXLSX() {
        const records = storage.getAllRecords();
        if (records.length === 0) {
            alert("No records to export.");
            return;
        }

        const longData = [];

        records.forEach(r => {
            // Tech Matrix
            FORM_SCHEMA.technicalMatrixRows.forEach(m => {
                longData.push({
                    "Participant Code": r.participantCode,
                    "Institution": r.participantInformation.institution,
                    "Section": "Technical Experience",
                    "Indicator": m.label,
                    "Rating": r.technicalExperience.matrix[m.id] || "",
                    "Scale": "1-5 Confidence"
                });
            });

            // Simulator Matrix
            FORM_SCHEMA.simulatorMatrixRows.forEach(m => {
                longData.push({
                    "Participant Code": r.participantCode,
                    "Institution": r.participantInformation.institution,
                    "Section": "Simulator Experience",
                    "Indicator": m.label,
                    "Rating": r.simulatorExperience.matrix[m.id] || "",
                    "Scale": "1-5 Confidence"
                });
            });

            // Instructional Matrix
            FORM_SCHEMA.instructionalMatrixRows.forEach(m => {
                longData.push({
                    "Participant Code": r.participantCode,
                    "Institution": r.participantInformation.institution,
                    "Section": "Instructional Needs",
                    "Indicator": m.label,
                    "Rating": r.instructionalNeeds.matrix[m.id] || "",
                    "Scale": "1-5 Support/Confidence"
                });
            });
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(longData), "Long Format Matrix");
        XLSX.writeFile(wb, `SEABERY_Long_Format_Ratings_${new Date().toISOString().slice(0,10)}.xlsx`);
    }
};
