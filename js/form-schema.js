/**
 * Application Data Schema and Options
 */
const FORM_SCHEMA = {
    schemaVersion: "1.0",
    
    positionOptions: [
        "Welding Instructor/Trainer",
        "Senior Instructor",
        "Master Trainer",
        "Training Manager/Supervisor",
        "Curriculum Specialist",
        "Assessment Specialist",
        "School Administrator",
        "Other"
    ],

    yearsTVETOptions: [
        "Less than 1 year",
        "1–3 years",
        "4–6 years",
        "7–10 years",
        "More than 10 years"
    ],

    yearsWeldingTeachingOptions: [
        "No prior experience",
        "Less than 1 year",
        "1–3 years",
        "4–6 years",
        "7–10 years",
        "More than 10 years"
    ],

    qualificationsHeldOptions: [
        "SMAW/MMA",
        "GMAW/MIG/MAG",
        "GTAW/TIG",
        "FCAW",
        "Welding inspection/quality assurance",
        "Trainer or assessor certification",
        "Other"
    ],

    highestQualificationOptions: [
        "Secondary education",
        "Technical-vocational certificate",
        "Diploma",
        "Bachelor’s degree",
        "Master’s degree",
        "Other"
    ],

    programsTaughtOptions: [
        "Basic welding",
        "SMAW/MMA",
        "GMAW/MIG/MAG",
        "GTAW/TIG",
        "FCAW",
        "Structural welding",
        "Pipe welding",
        "Fabrication and metalwork",
        "Welding inspection and quality control",
        "Other"
    ],

    classSizeOptions: [
        "Fewer than 10",
        "10–15",
        "16–20",
        "21–30",
        "More than 30"
    ],

    skillLevelOptions: [
        "Beginner",
        "Elementary",
        "Intermediate",
        "Advanced",
        "Mixed levels"
    ],

    challengesOptions: [
        "Difficulty understanding welding theory",
        "Incorrect welding position",
        "Poor hand movement and coordination",
        "Incorrect travel speed",
        "Incorrect electrode or torch angle",
        "Difficulty reading welding symbols",
        "Poor material preparation",
        "Inadequate safety practices",
        "Limited practice time",
        "High material and consumable costs",
        "Difficulty receiving immediate feedback",
        "Large class size",
        "Limited access to equipment",
        "Other"
    ],

    technicalMatrixRows: [
        { id: "tech_safety", label: "Welding safety and personal protective equipment" },
        { id: "tech_setup", label: "Welding machine setup" },
        { id: "tech_params", label: "Selection of welding parameters" },
        { id: "tech_electrode", label: "Electrode or filler-metal selection" },
        { id: "tech_positions", label: "Welding positions" },
        { id: "tech_joint_prep", label: "Joint preparation" },
        { id: "tech_symbols", label: "Reading welding symbols and procedures" },
        { id: "tech_visual_insp", label: "Visual inspection of welds" },
        { id: "tech_defects", label: "Identification of common welding defects" },
        { id: "tech_feedback", label: "Providing corrective feedback to learners" },
        { id: "tech_demo", label: "Demonstrating welding techniques" },
        { id: "tech_assessment", label: "Assessing practical welding performance" }
    ],

    processes12mOptions: [
        "SMAW/MMA",
        "GMAW/MIG/MAG",
        "GTAW/TIG",
        "FCAW",
        "Oxy-fuel welding/cutting",
        "Other",
        "None"
    ],

    processesTeachOptions: [
        "SMAW/MMA",
        "GMAW/MIG/MAG",
        "GTAW/TIG",
        "FCAW",
        "Other"
    ],

    simulatorTypeOptions: [
        "SEABERY/Soldamatic",
        "Virtual welding simulator from another provider",
        "Computer-based welding simulation",
        "Other"
    ],

    seaberyExperienceOptions: [
        "No experience",
        "Seen a demonstration only",
        "Used it once or twice",
        "Used it several times",
        "Regularly use it for instruction",
        "Have trained others to use it"
    ],

    simulatorMatrixRows: [
        { id: "sim_config", label: "Starting and configuring the simulator" },
        { id: "sim_process", label: "Selecting a welding process" },
        { id: "sim_materials", label: "Selecting materials and workpieces" },
        { id: "sim_params", label: "Setting welding parameters" },
        { id: "sim_positions", label: "Selecting welding positions" },
        { id: "sim_exercise", label: "Conducting a simulated welding exercise" },
        { id: "sim_feedback", label: "Interpreting simulator feedback" },
        { id: "sim_review", label: "Reviewing learner performance" },
        { id: "sim_reports", label: "Generating learner performance reports" },
        { id: "sim_teacher_sw", label: "Managing learners through teacher software" },
        { id: "sim_activities", label: "Designing or modifying simulator activities" },
        { id: "sim_assessment", label: "Integrating simulator results into assessment" }
    ],

    simulatorConcernsOptions: [
        "Limited technical knowledge",
        "Difficulty operating the equipment",
        "Difficulty interpreting performance data",
        "Limited time for practice",
        "Concern about equipment availability",
        "Concern about equipment maintenance",
        "Difficulty integrating it into existing lessons",
        "Difficulty aligning it with competency standards",
        "Difficulty assessing simulator-based performance",
        "No major concern",
        "Other"
    ],

    instructionalMatrixRows: [
        { id: "inst_lesson_plan", label: "Preparing a welding lesson plan" },
        { id: "inst_demo", label: "Demonstrating a welding procedure" },
        { id: "inst_guided_practice", label: "Conducting guided practice" },
        { id: "inst_questioning", label: "Using questioning techniques" },
        { id: "inst_corrective_fb", label: "Giving immediate corrective feedback" },
        { id: "inst_class_mgt", label: "Managing a practical welding class" },
        { id: "inst_rotations", label: "Organizing learner rotations" },
        { id: "inst_diff_instruct", label: "Differentiating instruction for mixed abilities" },
        { id: "inst_theory_practice", label: "Integrating theory and practical activities" },
        { id: "inst_digital_res", label: "Using digital learning resources" },
        { id: "inst_sim_before_live", label: "Using simulation before live welding practice" },
        { id: "inst_assess_comp", label: "Assessing practical competencies" },
        { id: "inst_rubrics", label: "Developing performance rubrics" },
        { id: "inst_feedback_improve", label: "Using assessment results to improve instruction" }
    ],

    teachingApproachesOptions: [
        "Demonstration and modeling",
        "Guided practice",
        "Simulation-based instruction",
        "Competency-based training",
        "Problem-based learning",
        "Peer learning",
        "Coaching and mentoring",
        "Differentiated instruction",
        "Blended learning",
        "Performance-based assessment",
        "Other"
    ],

    assessmentMethodsOptions: [
        "Written tests",
        "Oral questioning",
        "Practical demonstration",
        "Observation checklist",
        "Performance rubric",
        "Product or weld-quality inspection",
        "Portfolio of evidence",
        "Simulation performance data",
        "Combination of methods",
        "Other"
    ],

    assessmentDifficultiesOptions: [
        "Developing valid practical tasks",
        "Establishing performance standards",
        "Maintaining objectivity",
        "Providing consistent scores",
        "Assessing large classes",
        "Recording learner performance",
        "Giving timely feedback",
        "Aligning assessment with competency standards",
        "Using digital assessment tools",
        "Other"
    ],

    curriculumOutputsOptions: [
        "Curriculum mapping template",
        "Lesson plan integrating the simulator",
        "Welding simulation activity sheets",
        "Practical assessment checklist",
        "Performance rubric",
        "Learner rotation plan",
        "Simulator integration guide",
        "Equipment and resource checklist",
        "Institutional implementation plan",
        "Other"
    ],

    barriersOptions: [
        "Lack of simulator access",
        "Limited welding equipment",
        "Lack of trained personnel",
        "Limited budget",
        "Large class size",
        "Limited training time",
        "Lack of institutional support",
        "Curriculum or policy constraints",
        "Internet or connectivity limitations",
        "Maintenance and technical support concerns",
        "Other"
    ],

    supportNeedsOptions: [
        "Technical coaching",
        "Follow-up mentoring",
        "Additional simulator practice",
        "Digital learning materials",
        "Sample lesson plans",
        "Assessment tools",
        "Curriculum integration support",
        "Equipment and maintenance guidance",
        "Institutional action-planning support",
        "Community of practice",
        "Other"
    ],

    learningTopics: [
        { id: "topic_1", label: "Fundamentals of welding simulation" },
        { id: "topic_2", label: "SEABERY equipment setup and operation" },
        { id: "topic_3", label: "Teacher software functions" },
        { id: "topic_4", label: "Selection of welding processes and parameters" },
        { id: "topic_5", label: "Selection of workpieces and positions" },
        { id: "topic_6", label: "Conducting simulator-based exercises" },
        { id: "topic_7", label: "Interpreting simulator feedback" },
        { id: "topic_8", label: "Monitoring learner performance" },
        { id: "topic_9", label: "Generating performance reports" },
        { id: "topic_10", label: "Designing simulator-supported lessons" },
        { id: "topic_11", label: "Integrating simulation with live welding" },
        { id: "topic_12", label: "Managing practical class rotations" },
        { id: "topic_13", label: "Assessment of welding performance" },
        { id: "topic_14", label: "Use of rubrics and checklists" },
        { id: "topic_15", label: "Curriculum mapping and alignment" },
        { id: "topic_16", label: "Learner safety and risk management" },
        { id: "topic_17", label: "Troubleshooting common simulator problems" },
        { id: "topic_18", label: "Institutional implementation planning" }
    ],

    baselineQuestions: [
        {
            id: "bq1",
            text: "Question 1: The primary purpose of a welding simulator in instructor training is to:",
            options: [
                { key: "A", text: "Replace all live welding practice." },
                { key: "B", text: "Provide safe, repeatable, feedback-supported practice before or alongside live welding." },
                { key: "C", text: "Eliminate the need for welding instructors." },
                { key: "D", text: "Test only theoretical knowledge." }
            ],
            correct: "B"
        },
        {
            id: "bq2",
            text: "Question 2: Before conducting a simulator exercise, the instructor should first:",
            options: [
                { key: "A", text: "Allow learners to begin without instructions." },
                { key: "B", text: "Select random welding parameters." },
                { key: "C", text: "Explain the learning outcome, procedure, safety considerations, and performance criteria." },
                { key: "D", text: "Focus only on the final score." }
            ],
            correct: "C"
        },
        {
            id: "bq3",
            text: "Question 3: A simulator performance report is most useful when it is:",
            options: [
                { key: "A", text: "Stored without discussion." },
                { key: "B", text: "Used to provide feedback and identify areas for improvement." },
                { key: "C", text: "Used as the only evidence of all welding competence." },
                { key: "D", text: "Shared publicly without permission." }
            ],
            correct: "B"
        },
        {
            id: "bq4",
            text: "Question 4: When integrating simulation into a welding lesson, the most appropriate sequence is generally:",
            options: [
                { key: "A", text: "Assessment, no instruction, simulation, orientation." },
                { key: "B", text: "Orientation, demonstration or theory, guided simulation, feedback, and live practice where appropriate." },
                { key: "C", text: "Live welding only, followed by simulation." },
                { key: "D", text: "Simulation without performance criteria." }
            ],
            correct: "B"
        },
        {
            id: "bq5",
            text: "Question 5: A practical welding assessment should primarily measure:",
            options: [
                { key: "A", text: "Attendance." },
                { key: "B", text: "Speed alone." },
                { key: "C", text: "Observable performance against defined competency criteria." },
                { key: "D", text: "Ability to memorize terminology." }
            ],
            correct: "C"
        },
        {
            id: "bq6",
            text: "Question 6: If a learner repeatedly produces poor simulated weld results, the instructor should first:",
            options: [
                { key: "A", text: "Immediately assign a failing grade." },
                { key: "B", text: "Ignore the result." },
                { key: "C", text: "Review the performance data, observe the technique, identify the error, and provide corrective practice." },
                { key: "D", text: "Remove the learner from the course." }
            ],
            correct: "C"
        },
        {
            id: "bq7",
            text: "Question 7: A learner rotation plan is important when:",
            options: [
                { key: "A", text: "Equipment is limited." },
                { key: "B", text: "All learners can use equipment simultaneously." },
                { key: "C", text: "No practical activity is planned." },
                { key: "D", text: "Only one learner attends." }
            ],
            correct: "A"
        },
        {
            id: "bq8",
            text: "Question 8: Simulator-based activities should be aligned with:",
            options: [
                { key: "A", text: "The instructor’s personal preference only." },
                { key: "B", text: "Competency standards, learning outcomes, welding procedures, and assessment criteria." },
                { key: "C", text: "Random exercises." },
                { key: "D", text: "Equipment features without regard to curriculum." }
            ],
            correct: "B"
        },
        {
            id: "bq9",
            text: "Question 9: A performance rubric should contain:",
            options: [
                { key: "A", text: "Vague descriptions only." },
                { key: "B", text: "Observable criteria and levels of performance." },
                { key: "C", text: "Only the learner’s name." },
                { key: "D", text: "A final score without evidence." }
            ],
            correct: "B"
        },
        {
            id: "bq10",
            text: "Question 10: The most appropriate use of pre-training assessment results is to:",
            options: [
                { key: "A", text: "Rank participants publicly." },
                { key: "B", text: "Adjust the training design and identify areas requiring additional support." },
                { key: "C", text: "Exclude participants with lower scores." },
                { key: "D", text: "Replace the training program entirely." }
            ],
            correct: "B"
        }
    ]
};
