/**
 * Form Validation and Completion Tracker
 */
const validation = {
    /**
     * Validates a single step/part of the form.
     */
    validatePart(stepNumber, formData) {
        const errors = [];

        if (stepNumber === 1) {
            if (!formData.participantCode) errors.push("Participant code is required.");
            if (!formData.institution) errors.push("Institution or training center is required.");
            if (!formData.region) errors.push("Region or province is required.");
            if (!formData.position) errors.push("Current position is required.");
            if (!formData.highestQualification) errors.push("Highest qualification is required.");
            if (!formData.yearsTVET) errors.push("Years working in TVET is required.");
            if (!formData.yearsWeldingTeaching) errors.push("Years teaching welding is required.");
        }

        if (stepNumber === 2) {
            if (!formData.classSize) errors.push("Class size selection is required.");
            if (!formData.skillLevel) errors.push("Learner skill level selection is required.");
            if (formData.challenges && formData.challenges.length > 5) {
                errors.push("You can select up to a maximum of 5 learner challenges.");
            }
        }

        if (stepNumber === 3) {
            if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.technicalMatrixRows) {
                FORM_SCHEMA.technicalMatrixRows.forEach(row => {
                    if (!formData.technicalMatrix || !formData.technicalMatrix[row.id]) {
                        errors.push(`Rating missing for technical competency: "${row.label}"`);
                    }
                });
            }
        }

        if (stepNumber === 4) {
            if (!formData.usedSimulator) errors.push("Simulator experience status is required.");
            if (!formData.seaberyExperience) errors.push("SEABERY experience level is required.");
            if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.simulatorMatrixRows) {
                FORM_SCHEMA.simulatorMatrixRows.forEach(row => {
                    if (!formData.simulatorMatrix || !formData.simulatorMatrix[row.id]) {
                        errors.push(`Rating missing for simulator function: "${row.label}"`);
                    }
                });
            }
        }

        if (stepNumber === 5) {
            if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.instructionalMatrixRows) {
                FORM_SCHEMA.instructionalMatrixRows.forEach(row => {
                    if (!formData.instructionalMatrix || !formData.instructionalMatrix[row.id]) {
                        errors.push(`Rating missing for instructional area: "${row.label}"`);
                    }
                });
            }
        }

        if (stepNumber === 7) {
            if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.learningTopics) {
                FORM_SCHEMA.learningTopics.forEach(topic => {
                    const cur = formData.learningNeeds?.[topic.id]?.ability;
                    const imp = formData.learningNeeds?.[topic.id]?.importance;
                    if (!cur || !imp) {
                        errors.push(`Both Ability & Importance ratings required for topic: "${topic.label}"`);
                    }
                });
            }
        }

        if (stepNumber === 8) {
            if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.baselineQuestions) {
                FORM_SCHEMA.baselineQuestions.forEach((q, idx) => {
                    if (!formData.baselineAnswers || !formData.baselineAnswers[q.id]) {
                        errors.push(`Question ${idx + 1} in baseline check is unanswered.`);
                    }
                });
            }
            if (!formData.consent) {
                errors.push("You must accept the data privacy consent before submitting.");
            }
        }

        return errors;
    },

    /**
     * Validates all steps across the entire form (used prior to final submission).
     */
    validateAll(formData) {
        let allErrors = [];
        for (let step = 1; step <= 8; step++) {
            const stepErrors = this.validatePart(step, formData);
            if (stepErrors.length > 0) {
                allErrors.push(`--- Part ${step} ---`);
                allErrors = allErrors.concat(stepErrors);
            }
        }
        return allErrors;
    },

    /**
     * Calculates total completion percentage across required fields.
     */
    calculateCompletionPercentage(formData) {
        let totalItems = 0;
        let completedItems = 0;

        // Part 1
        totalItems += 7;
        if (formData.participantCode) completedItems++;
        if (formData.institution) completedItems++;
        if (formData.region) completedItems++;
        if (formData.position) completedItems++;
        if (formData.highestQualification) completedItems++;
        if (formData.yearsTVET) completedItems++;
        if (formData.yearsWeldingTeaching) completedItems++;

        // Part 2
        totalItems += 2;
        if (formData.classSize) completedItems++;
        if (formData.skillLevel) completedItems++;

        // Part 3 Matrix
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.technicalMatrixRows) {
            totalItems += FORM_SCHEMA.technicalMatrixRows.length;
            FORM_SCHEMA.technicalMatrixRows.forEach(row => {
                if (formData.technicalMatrix?.[row.id]) completedItems++;
            });
        }

        // Part 4 Matrix
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.simulatorMatrixRows) {
            totalItems += FORM_SCHEMA.simulatorMatrixRows.length;
            FORM_SCHEMA.simulatorMatrixRows.forEach(row => {
                if (formData.simulatorMatrix?.[row.id]) completedItems++;
            });
        }

        // Part 5 Matrix
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.instructionalMatrixRows) {
            totalItems += FORM_SCHEMA.instructionalMatrixRows.length;
            FORM_SCHEMA.instructionalMatrixRows.forEach(row => {
                if (formData.instructionalMatrix?.[row.id]) completedItems++;
            });
        }

        // Part 7 Matrix
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.learningTopics) {
            totalItems += FORM_SCHEMA.learningTopics.length;
            FORM_SCHEMA.learningTopics.forEach(topic => {
                if (formData.learningNeeds?.[topic.id]?.ability && formData.learningNeeds?.[topic.id]?.importance) {
                    completedItems++;
                }
            });
        }

        // Part 8 Baseline
        if (typeof FORM_SCHEMA !== 'undefined' && FORM_SCHEMA.baselineQuestions) {
            totalItems += FORM_SCHEMA.baselineQuestions.length;
            FORM_SCHEMA.baselineQuestions.forEach(q => {
                if (formData.baselineAnswers?.[q.id]) completedItems++;
            });
        }

        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }
};
