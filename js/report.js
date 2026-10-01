/**
 * Automatic Comprehensive Assessment Report Generator
 */
const report = {
    generateReportHTML() {
        const records = storage.getAllRecords();
        const container = document.getElementById("reportPrintArea");

        if (!records || records.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning text-center p-5">
                    <i class="bi bi-exclamation-triangle display-4 d-block mb-3"></i>
                    <h4>No Assessment Data Available</h4>
                    <p class="mb-0">No assessment data are currently available. Complete and save at least one participant assessment to generate the report.</p>
                </div>
            `;
            return;
        }

        const stats = analytics.processData(records);

        container.innerHTML = `
            <div class="text-center mb-5 pb-3 border-bottom">
                <h2 class="fw-bold text-navy">WELDING INSTRUCTORS TRAINING UTILIZING SEABERY WELDING SIMULATOR</h2>
                <h4 class="text-secondary">Participant Expectations and Pre-Training Needs Assessment Report</h4>
                <div class="mt-3 text-muted small">
                    <span><strong>Date Generated:</strong> ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</span> | 
                    <span><strong>Total Respondents:</strong> ${stats.totalRecords} Welding Instructors</span> | 
                    <span><strong>Institutions Represented:</strong> ${stats.institutionsCount}</span>
                </div>
            </div>

            <!-- Executive Summary -->
            <div class="report-section">
                <h4 class="report-section-title">1. Executive Summary</h4>
                <p>
                    This comprehensive pre-training needs assessment synthesizes diagnostic feedback collected from <strong>${stats.totalRecords} TVET welding instructors</strong> across <strong>${stats.institutionsCount} training institutions</strong>.
                    Among the respondents, <strong>${stats.priorSimPct}% reported prior experience</strong> with a welding simulator, whereas <strong>${100 - stats.priorSimPct}% reported no prior simulator experience</strong>.
                </p>
                <p>
                    The overarching baseline knowledge score across participants is <strong>${stats.meanBaseline}%</strong>, indicating a <em>${stats.meanBaseline >= 80 ? 'Strong' : (stats.meanBaseline >= 60 ? 'Moderate' : 'Foundational')}</em> theoretical foundation in simulation pedagogy.
                    The assessment identified significant priority learning gaps in <strong>Teacher Software Functions, Interpretation of Simulator Feedback, and Integration of Simulation into Live Welding Rotations</strong>.
                </p>
            </div>

            <!-- Participant Profile -->
            <div class="report-section">
                <h4 class="report-section-title">2. Participant Demographics & Teaching Assignments</h4>
                <div class="table-responsive mb-3">
                    <table class="table table-sm table-bordered align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Metric</th>
                                <th>Assessment Findings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Participants</td>
                                <td><strong>${stats.totalRecords}</strong></td>
                            </tr>
                            <tr>
                                <td>Overall Baseline Knowledge Score</td>
                                <td><strong>${stats.meanBaseline}%</strong></td>
                            </tr>
                            <tr>
                                <td>Mean Technical Confidence</td>
                                <td><strong>${stats.meanTechConf} / 5.00</strong> (${analytics.getConfidenceBand(stats.meanTechConf)})</td>
                            </tr>
                            <tr>
                                <td>Mean Simulator Operational Confidence</td>
                                <td><strong>${stats.meanSimConf} / 5.00</strong> (${analytics.getConfidenceBand(stats.meanSimConf)})</td>
                            </tr>
                            <tr>
                                <td>Mean Instructional Confidence</td>
                                <td><strong>${stats.meanInstConf} / 5.00</strong> (${analytics.getConfidenceBand(stats.meanInstConf)})</td>
                            </tr>
                            <tr>
                                <td>Mean Priority Learning Gap</td>
                                <td><strong class="text-danger">${stats.meanPriorityGap}</strong> (${analytics.getPriorityGapBand(stats.meanPriorityGap)})</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Top Priority Training Needs -->
            <div class="report-section">
                <h4 class="report-section-title">3. Priority Training Needs & Gap Rankings</h4>
                <p>The table below ranks the top learning topics according to calculated Priority Gaps (Importance – Current Ability):</p>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th>Rank</th>
                                <th>Training Topic</th>
                                <th>Ability (1-5)</th>
                                <th>Importance (1-5)</th>
                                <th>Priority Gap</th>
                                <th>Priority Band</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.learningTopicStats.slice(0, 10).map((t, idx) => `
                                <tr>
                                    <td><strong>#${idx + 1}</strong></td>
                                    <td>${t.label}</td>
                                    <td>${t.meanAbility}</td>
                                    <td>${t.meanImportance}</td>
                                    <td><span class="badge bg-danger">${t.meanGap}</span></td>
                                    <td>${t.band}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Strategic Recommendations -->
            <div class="report-section">
                <h4 class="report-section-title">4. Strategic Recommendations for 4-Day Training Program</h4>
                <ul class="list-group list-group-flush border rounded p-2">
                    <li class="list-group-item"><strong>Day 1 Focus:</strong> Devote substantial time to basic simulator configuration, calibration, and understanding real-time visual arc parameters.</li>
                    <li class="list-group-item"><strong>Day 2 Focus:</strong> Deep-dive into teacher software management, creating customized student rosters, and configuring exercise tolerance levels.</li>
                    <li class="list-group-item"><strong>Day 3 Focus:</strong> Hands-on workshop on generating learner performance reports and designing simulator-to-live workshop rotation plans.</li>
                    <li class="list-group-item"><strong>Day 4 Focus:</strong> Formative and summative assessment rubric formulation, alignment with national TVET competency standards, and institutional action planning.</li>
                </ul>
            </div>
        `;
    },

    printReport() {
        window.print();
    },

    downloadPDF() {
        const element = document.getElementById("reportPrintArea");
        const opt = {
            margin: 0.5,
            filename: `SEABERY_Assessment_Report_${new Date().toISOString().slice(0,10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        // Use jsPDF / html2canvas
        if (window.html2canvas && window.jspdf) {
            const { jsPDF } = window.jspdf;
            html2canvas(element, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`SEABERY_Assessment_Report_${new Date().toISOString().slice(0,10)}.pdf`);
            });
        } else {
            window.print();
        }
    }
};
