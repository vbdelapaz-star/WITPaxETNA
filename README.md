# Welding Instructors Training Utilizing SEABERY Welding Simulator
## Participant Expectations and Pre-Training Needs Assessment Web Application

A production-ready, browser-based static web application designed for TVET welding instructor capacity building, diagnostic assessment, priority gap analytics, and automatic executive report generation.

---

## 🌟 Key Application Features

1. **Client-Side Architecture:** Runs 100% in modern web browsers using Vanilla HTML5, CSS3, JavaScript ES6+, Bootstrap 5, Chart.js, and SheetJS.
2. **Local Storage & Privacy:** All participant submissions stay isolated within browser LocalStorage/IndexedDB.
3. **8-Step Comprehensive Needs Assessment:**
   - **Part I:** Participant Profile & Qualifications
   - **Part II:** Current Teaching Assignment & Class Size
   - **Part III:** Technical Competency Confidence Matrix
   - **Part IV:** SEABERY Simulator Operational Experience Matrix
   - **Part V:** Instructional & Pedagogical Support Matrix
   - **Part VI:** Open Forum Participant Expectations & Support Needs
   - **Part VII:** Self-Assessment Learning Needs & Priority Gap Calculator ($Gap = Importance - Ability$)
   - **Part VIII:** 10-Question Baseline Knowledge Check
4. **Analytics Dashboard:** 14 Chart.js visualizations covering demographics, competency matrices, top priority gaps, and learner obstacles.
5. **Data Management & Export:** Export complete dataset to 12-sheet Excel files (.XLSX), CSV format, long-format matrix ratings, or JSON backup files.
6. **Automatic Executive Report Generator:** Produces professional printable narrative assessment reports with PDF export capability.

---

## 🚀 Deployment to GitHub Pages

1. **Create a GitHub Repository:**
   Initialize a public repository on GitHub and push all source files (`index.html`, `styles.css`, `js/`, `.github/workflows/deploy.yml`).

2. **Configure Pages Settings:**
   - Navigate to **Settings** > **Pages** in your repository.
   - Under **Build and Deployment**, set **Source** to `GitHub Actions`.

3. **Automatic Workflow Execution:**
   - On every push to the `main` branch, the `.github/workflows/deploy.yml` Action automatically deploys the static web app to `https://<your-username>.github.io/<repo-name>/`.

---

## 📊 Data Dictionary Overview

| Field Name | Description | Scale / Options |
| :--- | :--- | :--- |
| `participantCode` | Auto-generated unique ID | e.g., WELD-0001 |
| `technicalMatrix` | Technical welding confidence rating | 1 (No Confidence) – 5 (Highly Confident) |
| `simulatorMatrix` | SEABERY operational confidence | 1 (No Confidence) – 5 (Highly Confident) |
| `instructionalMatrix` | Pedagogical support needed | 1 (Needs Substantial Support) – 5 (Highly Competent) |
| `priorityGap` | Calculated learning need priority | $Priority Gap = Training Importance - Current Ability$ |
| `baselinePercentage` | Quiz score percentage | 0% – 100% |

---

## 🔒 Data Protection & Privacy Notice

This application stores assessment data locally inside the user's browser storage. Users are responsible for maintaining confidentiality when exporting Excel files or JSON backups. No external telemetry or tracking scripts are deployed.
