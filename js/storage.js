/**
 * Local Data Persistence using LocalStorage
 */
const storage = {
    KEYS: {
        RECORDS: "seabery_assessment_records",
        DRAFT: "seabery_assessment_draft",
        SETTINGS: "seabery_assessment_settings"
    },

    saveDraft(formData) {
        try {
            const dataToSave = {
                formData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(this.KEYS.DRAFT, JSON.stringify(dataToSave));
            return true;
        } catch (e) {
            console.error("Error saving draft:", e);
            return false;
        }
    },

    loadDraft() {
        try {
            const draft = localStorage.getItem(this.KEYS.DRAFT);
            return draft ? JSON.parse(draft) : null;
        } catch (e) {
            console.error("Error loading draft:", e);
            return null;
        }
    },

    deleteDraft() {
        localStorage.removeItem(this.KEYS.DRAFT);
    },

    saveCompletedRecord(record) {
        try {
            const records = this.getAllRecords();
            // Check if existing recordId, if so update, else add
            const index = records.findIndex(r => r.recordId === record.recordId);
            if (index >= 0) {
                records[index] = record;
            } else {
                records.push(record);
            }
            localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(records));
            this.deleteDraft(); // clear draft upon successful save
            return true;
        } catch (e) {
            console.error("Error saving record:", e);
            return false;
        }
    },

    getAllRecords() {
        try {
            const data = localStorage.getItem(this.KEYS.RECORDS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error fetching records:", e);
            return [];
        }
    },

    getRecordById(recordId) {
        const records = this.getAllRecords();
        return records.find(r => r.recordId === recordId) || null;
    },

    deleteRecord(recordId) {
        let records = this.getAllRecords();
        records = records.filter(r => r.recordId !== recordId);
        localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(records));
    },

    deleteSelectedRecords(recordIds) {
        let records = this.getAllRecords();
        records = records.filter(r => !recordIds.includes(r.recordId));
        localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(records));
    },

    clearAllRecords() {
        localStorage.removeItem(this.KEYS.RECORDS);
    },

    getSettings() {
        const settings = localStorage.getItem(this.KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : { googleClientId: "", googleSpreadsheetId: "" };
    },

    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    exportBackupJSON() {
        const records = this.getAllRecords();
        const backupData = {
            exportDate: new Date().toISOString(),
            application: "Welding Instructors Training SEABERY Assessment",
            version: "1.0",
            recordCount: records.length,
            records: records
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SEABERY_Assessment_Backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    importBackupJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed && Array.isArray(parsed.records)) {
                const existing = this.getAllRecords();
                // Merge by recordId
                const map = new Map();
                existing.forEach(r => map.set(r.recordId, r));
                parsed.records.forEach(r => map.set(r.recordId, r));
                const merged = Array.from(map.values());
                localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(merged));
                return { success: true, count: parsed.records.length };
            }
            return { success: false, error: "Invalid backup file structure." };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
};
