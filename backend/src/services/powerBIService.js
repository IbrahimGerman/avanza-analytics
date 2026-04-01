const XLSX = require('xlsx');
const path = require('path');

// This replaces your mock token logic
const getToken = async () => {
    return "local_session_token";
};

// This replaces your "mocked data" with the ACTUAL Excel data
const fetchPowerBIData = async () => {
    try {
        // 1. Point to the file in the data directory
        const filePath = path.join(__dirname, '../../data/leads.csv');

        // 2. Read the file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Map the fields from leads.csv to what the dashboard expects
        const mappedData = sheetData.map(row => ({
            "Consultant Name": row.resource_name,
            "Status": row.status,
            "Region": row.region,
            "Role": row.category || "Consultant",
            "Revenue": row.revenue || row.signing_value || 0
        }));

        console.log("Success: Loaded " + mappedData.length + " rows from leads.csv.");

        // 3. Return the mapped data to your dashboard
        return {
            data: mappedData
        };
    } catch (error) {
        console.error("Error: Could not read leads.csv. Make sure the file is in the data folder!", error.message);
        return { data: [] };
    }
};

module.exports = { getToken, fetchPowerBIData };