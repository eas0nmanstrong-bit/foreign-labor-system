const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Labor, Client, Contract, User } = require('./src/models');
const { connectDB } = require('./src/database');

// Generate contract number
const generateContractNumber = (index) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const sequence = String(index + 1).padStart(3, '0');
    return `LC-${year}${month}-${sequence}`;
};

// Create PDF contract
const createLaborContract = (labor, client, contractNumber, outputPath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Title
        doc.fontSize(20).font('Helvetica-Bold').text('勞動契約書', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text(`合約編號：${contractNumber}`, { align: 'right' });
        doc.moveDown(2);

        // Contract parties
        doc.fontSize(14).font('Helvetica-Bold').text('甲方（雇主）', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica');
        doc.text(`雇主名稱：${client?.name || '未指定'}`);
        doc.text(`統一編號：${client?.tax_id || 'N/A'}`);
        doc.text(`聯絡電話：${client?.phone || 'N/A'}`);
        doc.text(`地址：${client?.address || 'N/A'}`);
        doc.moveDown(1.5);

        doc.fontSize(14).font('Helvetica-Bold').text('乙方（外籍勞工）', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica');
        doc.text(`中文姓名：${labor.name_zh || 'N/A'}`);
        doc.text(`英文姓名：${labor.name_en}`);
        doc.text(`護照號碼：${labor.passport_no || 'N/A'}`);
        doc.text(`居留證號：${labor.arc_no || 'N/A'}`);
        doc.text(`居留證效期：${labor.arc_expiry_date || 'N/A'}`);
        doc.text(`居住地址：${labor.residence_address || 'N/A'}`);
        doc.moveDown(2);

        // Contract terms
        doc.fontSize(14).font('Helvetica-Bold').text('契約條款', { underline: true });
        doc.moveDown(1);

        const terms = [
            {
                title: '第一條 契約期間',
                content: `本契約自民國 ${labor.employment_date || '___'} 起生效，為期三年。`
            },
            {
                title: '第二條 工作內容',
                content: '乙方同意依甲方指示從事家庭看護工作，包括但不限於照顧被看護者之日常生活起居、協助就醫等事項。'
            },
            {
                title: '第三條 工作時間',
                content: '乙方每日工作時間為8小時，每週工作6天，每週至少休假1天。'
            },
            {
                title: '第四條 薪資給付',
                content: '甲方每月給付乙方薪資新台幣20,000元整，於每月5日前給付。'
            },
            {
                title: '第五條 膳宿',
                content: '甲方應提供乙方適當之膳食及住宿，住宿應有獨立之休息空間。'
            },
            {
                title: '第六條 保險',
                content: '甲方應依法為乙方投保勞工保險及全民健康保險。'
            },
            {
                title: '第七條 契約終止',
                content: '雙方如欲終止契約，應於30日前以書面通知他方。'
            }
        ];

        terms.forEach((term, index) => {
            doc.fontSize(12).font('Helvetica-Bold').text(term.title);
            doc.fontSize(10).font('Helvetica').text(term.content, { indent: 20 });
            doc.moveDown(1);
        });

        doc.moveDown(2);

        // Signatures
        doc.fontSize(11).font('Helvetica');
        const signatureY = doc.y;
        doc.text('甲方（雇主）簽章：_______________', 50, signatureY);
        doc.text('乙方（外勞）簽章：_______________', 300, signatureY);
        doc.moveDown(2);

        const dateY = doc.y;
        const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
        doc.text(`簽約日期：中華民國 ${today}`, 50, dateY);

        doc.end();

        stream.on('finish', () => resolve());
        stream.on('error', reject);
    });
};

// Main function
const generateLaborContracts = async () => {
    try {
        await connectDB();

        // Get admin user
        const admin = await User.findOne({ where: { username: 'adm' } });
        if (!admin) {
            console.error('Admin user not found');
            process.exit(1);
        }

        // Create uploads directory
        const uploadsDir = path.join(__dirname, 'uploads/contracts');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Get all labors with their clients
        const labors = await Labor.findAll({
            include: {
                model: Client,
                attributes: ['name', 'tax_id', 'phone', 'address']
            }
        });

        console.log(`Found ${labors.length} labors`);

        for (let i = 0; i < labors.length; i++) {
            const labor = labors[i];
            const contractNumber = generateContractNumber(i);
            const filename = `${contractNumber}.pdf`;
            const filePath = path.join(uploadsDir, filename);

            // Generate PDF
            await createLaborContract(labor, labor.Client, contractNumber, filePath);

            // Get file size
            const stats = fs.statSync(filePath);

            // Create database record
            await Contract.create({
                contract_number: contractNumber,
                filename: filename,
                original_name: `勞動契約-${labor.name_zh || labor.name_en}.pdf`,
                category: '勞動合約',
                file_path: filePath,
                file_size: stats.size,
                mime_type: 'application/pdf',
                description: `${labor.name_zh || labor.name_en}的勞動契約書`,
                labor_id: labor.id,
                uploaded_by: admin.id
            });

            console.log(`✅ Generated contract for ${labor.name_zh || labor.name_en} (${contractNumber})`);
        }

        console.log(`\n🎉 Successfully generated ${labors.length} labor contracts!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

generateLaborContracts();
