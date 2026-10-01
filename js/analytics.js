/**
 * Statistical Analytics and Chart.js Rendering Engine
 */
const analytics = {
    chartInstances: {},

    calculateMean(arr) {
        if (!arr || arr.length === 0) return 0;
        const sum = arr.reduce((acc, val) => acc + Number(val), 0);
        return (sum / arr.length).toFixed(2);
    },

    calculateMedian(arr) {
        if (!arr || arr.length === 0) return 0;
        const sorted = [...arr].map(Number).sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
    },

    calculateSD(arr) {
        if (!arr || arr.length < 2) return 0;
        const mean = arr.reduce((a, b) => a + Number(b), 0) / arr.length;
        const variance = arr.reduce((a, b) => a + Math.pow(Number(b) - mean, 2), 0) / (arr.length - 1);
        return Math.sqrt(variance).toFixed(2);
    },

    getConfidenceBand(meanVal) {
        const val = Number(meanVal);
        if (val <= 1.80) return "Very low";
        if (val <= 2.60) return "Low";
        if (val <= 3.40) return "Moderate";
        if (val <= 4.20) return "High";
        return "Very high";
    },

    getPriorityGapBand(gapVal) {
        const val = Number(gapVal);
        if (val <= 0.49) return "No immediate gap";
        if (val <= 1.49) return "Low gap";
        if (val <= 2.49) return "Moderate gap";
        if (val <= 3.49) return "High gap";
        return "Very high gap";
    },

    processData(records) {
        if (!records || records.length === 0) return null;

        const totalRecords = records.length;
        const institutions = [...new Set(records.map(r => r.participantInformation.institution))];
        const regions = [...new Set(records.map(r => r.participantInformation.region))];

        // Overall Average Scores
        const baselineScores = records.map(r => r.computedScores.baselinePercentage);
        const meanBaseline = this.calculateMean(baselineScores);

        // Technical Matrix Overall Mean
        const techRatings = [];
        records.forEach(r => {
            Object.values(r.technicalExperience.matrix || {}).forEach(v => techRatings.push(v));
        });
        const meanTechConf = this.calculateMean(techRatings);

        // Simulator Matrix Overall Mean
        const simRatings = [];
        records.forEach(r => {
            Object.values(r.simulatorExperience.matrix || {}).forEach(v => simRatings.push(v));
        });
        const meanSimConf = this.calculateMean(simRatings);

        // Instructional Matrix Overall Mean
        const instRatings = [];
        records.forEach(r => {
            Object.values(r.instructionalNeeds.matrix || {}).forEach(v => instRatings.push(v));
        });
        const meanInstConf = this.calculateMean(instRatings);

        // Priority Gaps Overall Mean
        const gapValues = [];
        records.forEach(r => {
            (r.priorityGaps || []).forEach(g => gapValues.push(g.gap));
        });
        const meanPriorityGap = this.calculateMean(gapValues);

        // Prior simulator experience percentage
        const priorSimYes = records.filter(r => r.simulatorExperience.usedSimulator === "Yes").length;
        const priorSimPct = Math.round((priorSimYes / totalRecords) * 100);

        // Items Aggregations for Matrices
        const techCompetencyStats = FORM_SCHEMA.technicalMatrixRows.map(row => {
            const vals = records.map(r => r.technicalExperience.matrix[row.id]).filter(Boolean);
            return {
                id: row.id,
                label: row.label,
                mean: this.calculateMean(vals),
                median: this.calculateMedian(vals),
                sd: this.calculateSD(vals),
                min: vals.length ? Math.min(...vals) : 0,
                max: vals.length ? Math.max(...vals) : 0
            };
        });

        const simCompetencyStats = FORM_SCHEMA.simulatorMatrixRows.map(row => {
            const vals = records.map(r => r.simulatorExperience.matrix[row.id]).filter(Boolean);
            return {
                id: row.id,
                label: row.label,
                mean: this.calculateMean(vals),
                median: this.calculateMedian(vals),
                sd: this.calculateSD(vals),
                min: vals.length ? Math.min(...vals) : 0,
                max: vals.length ? Math.max(...vals) : 0
            };
        });

        const instCompetencyStats = FORM_SCHEMA.instructionalMatrixRows.map(row => {
            const vals = records.map(r => r.instructionalNeeds.matrix[row.id]).filter(Boolean);
            return {
                id: row.id,
                label: row.label,
                mean: this.calculateMean(vals),
                median: this.calculateMedian(vals),
                sd: this.calculateSD(vals),
                min: vals.length ? Math.min(...vals) : 0,
                max: vals.length ? Math.max(...vals) : 0
            };
        });

        // Learning Priority Gap Aggregation
        const learningTopicStats = FORM_SCHEMA.learningTopics.map(topic => {
            const abilities = records.map(r => r.learningNeeds[topic.id]?.ability).filter(Boolean);
            const importances = records.map(r => r.learningNeeds[topic.id]?.importance).filter(Boolean);
            const gaps = records.map(r => {
                const item = (r.priorityGaps || []).find(g => g.topicId === topic.id);
                return item ? item.gap : 0;
            });

            const meanGap = this.calculateMean(gaps);
            return {
                id: topic.id,
                label: topic.label,
                meanAbility: this.calculateMean(abilities),
                meanImportance: this.calculateMean(importances),
                meanGap: meanGap,
                medianGap: this.calculateMedian(gaps),
                sdGap: this.calculateSD(gaps),
                band: this.getPriorityGapBand(meanGap)
            };
        }).sort((a, b) => b.meanGap - a.meanGap); // Sort by highest priority gap

        return {
            totalRecords,
            institutionsCount: institutions.length,
            regionsCount: regions.length,
            meanBaseline,
            meanTechConf,
            meanSimConf,
            meanInstConf,
            meanPriorityGap,
            priorSimPct,
            techCompetencyStats,
            simCompetencyStats,
            instCompetencyStats,
            learningTopicStats
        };
    },

    renderDashboard(records) {
        const data = this.processData(records);
        if (!data) return;

        // Update KPI Cards
        document.getElementById("kpiTotalParticipants").textContent = data.totalRecords;
        document.getElementById("kpiTotalInstitutions").textContent = `${data.institutionsCount} Institutions`;
        document.getElementById("kpiAvgBaseline").textContent = `${data.meanBaseline}%`;
        document.getElementById("kpiBaselineLevel").textContent = data.meanBaseline >= 80 ? "Strong Baseline" : (data.meanBaseline >= 60 ? "Moderate Baseline" : "Requires Support");
        document.getElementById("kpiAvgTechConf").textContent = `${data.meanTechConf} / 5.0`;
        document.getElementById("kpiTechBand").textContent = `Band: ${this.getConfidenceBand(data.meanTechConf)}`;
        document.getElementById("kpiAvgPriorityGap").textContent = data.meanPriorityGap;
        document.getElementById("kpiGapBand").textContent = `Band: ${data.getPriorityGapBand ? data.getPriorityGapBand(data.meanPriorityGap) : this.getPriorityGapBand(data.meanPriorityGap)}`;
        document.getElementById("analyticsRecordCount").textContent = `Based on ${data.totalRecords} participant assessment(s)`;

        // Helper to count frequencies
        const countFreq = (getArr) => {
            const counts = {};
            records.forEach(r => {
                const items = getArr(r);
                if (Array.isArray(items)) {
                    items.forEach(i => counts[i] = (counts[i] || 0) + 1);
                } else if (items) {
                    counts[items] = (counts[items] || 0) + 1;
                }
            });
            return counts;
        };

        // Render Charts
        this.renderBarChart("chartInstitutions", countFreq(r => r.participantInformation.institution), "Participants");
        this.renderBarChart("chartRegions", countFreq(r => r.participantInformation.region), "Participants");
        this.renderPieChart("chartYearsTeaching", countFreq(r => r.participantInformation.yearsWeldingTeaching));
        this.renderBarChart("chartProcessesTaught", countFreq(r => r.currentTeachingAssignment.programsTaught), "Instructors");
        this.renderPieChart("chartPriorSimulator", countFreq(r => r.simulatorExperience.usedSimulator));
        
        // Baseline Distribution
        const bDist = { "Strong (80-100%)": 0, "Moderate (60-79%)": 0, "Foundational (<60%)": 0 };
        records.forEach(r => {
            const score = r.computedScores.baselinePercentage;
            if (score >= 80) bDist["Strong (80-100%)"]++;
            else if (score >= 60) bDist["Moderate (60-79%)"]++;
            else bDist["Foundational (<60%)"]++;
        });
        this.renderPieChart("chartBaselineDist", bDist);

        // Technical Matrix Chart
        this.renderHorizontalBarChart("chartTechnicalMatrix", data.techCompetencyStats.map(s => s.label), data.techCompetencyStats.map(s => s.mean), "Mean Confidence (1-5)");
        
        // Simulator Matrix Chart
        this.renderHorizontalBarChart("chartSimulatorMatrix", data.simCompetencyStats.map(s => s.label), data.simCompetencyStats.map(s => s.mean), "Mean Confidence (1-5)");

        // Instructional Matrix Chart
        this.renderHorizontalBarChart("chartInstructionalMatrix", data.instCompetencyStats.map(s => s.label), data.instCompetencyStats.map(s => s.mean), "Mean Confidence (1-5)");

        // Top Priority Gaps Chart
        this.renderHorizontalBarChart("chartPriorityGaps", data.learningTopicStats.map(s => s.label), data.learningTopicStats.map(s => s.meanGap), "Mean Priority Gap", "#f36b21");

        // Multi-select charts
        this.renderBarChart("chartChallenges", countFreq(r => r.currentTeachingAssignment.challenges), "Frequency");
        this.renderBarChart("chartBarriers", countFreq(r => r.openForumExpectations.barriers), "Frequency");
        this.renderBarChart("chartOutputs", countFreq(r => r.instructionalNeeds.curriculumOutputs), "Frequency");
        this.renderBarChart("chartSupportNeeds", countFreq(r => r.openForumExpectations.supportNeeds), "Frequency");
    },

    createChart(canvasId, type, data, options) {
        if (this.chartInstances[canvasId]) {
            this.chartInstances[canvasId].destroy();
        }
        const ctx = document.getElementById(canvasId).getContext("2d");
        this.chartInstances[canvasId] = new Chart(ctx, { type, data, options });
    },

    renderBarChart(canvasId, freqObj, labelName) {
        const labels = Object.keys(freqObj);
        const values = Object.values(freqObj);
        this.createChart(canvasId, "bar", {
            labels,
            datasets: [{ label: labelName, data: values, backgroundColor: "#0d233a" }]
        }, { responsive: true, maintainAspectRatio: false });
    },

    renderHorizontalBarChart(canvasId, labels, values, labelName, color = "#4a607a") {
        this.createChart(canvasId, "bar", {
            labels,
            datasets: [{ label: labelName, data: values, backgroundColor: color }]
        }, {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { beginAtZero: true } }
        });
    },

    renderPieChart(canvasId, freqObj) {
        const labels = Object.keys(freqObj);
        const values = Object.values(freqObj);
        this.createChart(canvasId, "pie", {
            labels,
            datasets: [{
                data: values,
                backgroundColor: ["#0d233a", "#4a607a", "#f36b21", "#28a745", "#ffc107", "#17a2b8"]
            }]
        }, { responsive: true, maintainAspectRatio: false });
    }
};
