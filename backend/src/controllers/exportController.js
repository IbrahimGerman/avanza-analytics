const exceljs = require('exceljs');
const PDFDocument = require('pdfkit');

const exportExcel = async (req, res) => {
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Power BI Export');

        worksheet.columns = [
            { header: 'Metric Name', key: 'metric', width: 30 },
            { header: 'Value', key: 'value', width: 30 }
        ];

        worksheet.addRows([
            { metric: 'Win Rate', value: '14.2%' },
            { metric: 'Signing Value', value: '$1.58M' },
            { metric: 'Lead Metrics (Qualified)', value: '150' },
            { metric: 'Lead Metrics (Unqualified)', value: '50' },
            { metric: 'Sales Performance (Region A)', value: '$1.00M' },
            { metric: 'Sales Performance (Region B)', value: '$580k' },
            { metric: 'Summary Insights', value: 'Strong Q1 performance with high conversion' }
        ]);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=powerbi_export.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Excel Export Error:', error);
        res.status(500).json({ error: 'Failed to generate Excel' });
    }
};

const exportPdf = async (req, res) => {
    try {
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=powerbi_export.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Power BI Dashboard Export', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text('Analytics Metrics:');
        doc.moveDown();

        doc.fontSize(12).text('- Win Rate: 14.2%');
        doc.text('- Signing Value: $1.58M');
        doc.text('- Lead Metrics: Qualified (150), Unqualified (50)');
        doc.text('- Sales Performance: Region A ($1.00M), Region B ($580k)');
        doc.text('- Summary insights: Strong Q1 pipeline with converting leads.');

        doc.end();
    } catch (error) {
        console.error('PDF Export Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

module.exports = { exportExcel, exportPdf };
