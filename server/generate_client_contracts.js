const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Client, Contract, User } = require('./src/models');
const { connectDB } = require('./src/database');

// Generate contract number
const generateContractNumber = (index) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const sequence = String(index + 1).padStart(3, '0');
    return `CC-${year}${month}-${sequence}`;
};

// Create PDF contract
const createClientContract = (client, contractNumber, outputPath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Title
        doc.fontSize(20).font('Helvetica-Bold').text('雇主服務契約書', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text(`合約編號：${contractNumber}`, { align: 'right' });
        doc.moveDown(2);

        // Contract parties
        doc.fontSize(14).font('Helvetica-Bold').text('甲方（本公司）', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica');
        doc.text(`公司名稱：外勞仲介管理系統公司`);
        doc.text(`統一編號：12345678`);
        doc.text(`聯絡電話：02-1234-5678`);
        doc.text(`地址：台北市信義區信義路五段7號`);
        doc.moveDown(1.5);

        doc.fontSize(14).font('Helvetica-Bold').text('乙方（雇主）', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica');
        doc.text(`雇主編號：${client.client_no}`);
        doc.text(`雇主名稱：${client.name}`);
        doc.text(`統一編號：${client.tax_id || 'N/A'}`);
        doc.text(`聯絡人：${client.contact_person || 'N/A'}`);
        doc.text(`聯絡電話：${client.phone || 'N/A'}`);
        doc.text(`地址：${client.address || 'N/A'}`);
        doc.moveDown(2);

        // Contract terms
        doc.fontSize(14).font('Helvetica-Bold').text('契約條款', { underline: true });
        doc.moveDown(1);

        const terms = [
            {
                title: '第一條 契約期間',
                content: '本契約自簽訂日起生效，有效期限為三年，期滿前六十日內雙方如無異議，自動續約一年。'
            },
            {
                title: '第二條 服務內容',
                content: '甲方同意為乙方提供外籍勞工仲介服務，包括招募、面試、申請工作許可、居留證等相關事宜。'
            },
            {
                title: '第三條 服務費用',
                content: '乙方應依約定支付服務費用，包括仲介費、服務費及其他相關費用。'
            },
            {
                title: '第四條 雇主義務',
                content: '乙方應依勞動基準法及相關法令規定，善盡雇主責任，提供外籍勞工適當之工作環境及生活照顧。'
            },
            {
                title: '第五條 甲方義務',
                content: '甲方應協助乙方處理外籍勞工相關事務，包括但不限於居留證延期、轉換雇主等行政作業。'
            },
            {
                title: '第六條 契約終止',
                content: '任一方欲終止本契約，應於六十日前以書面通知他方，並完成相關交接事宜。'
            },
            {
                title: '第七條 爭議處理',
                content: '因本契約所生之爭議，雙方同意以台灣台北地方法院為第一審管轄法院。'
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
        doc.text('甲方（公司）簽章：_______________', 50, signatureY);
        doc.text('乙方（雇主）簽章：_______________', 300, signatureY);
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
const generateClientContracts = async () => {
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

        // Get all clients
        const clients = await Client.findAll();

        console.log(`Found ${clients.length} clients`);

        for (let i = 0; i < clients.length; i++) {
            const client = clients[i];
            const contractNumber = generateContractNumber(i);
            const filename = `${contractNumber}.pdf`;
            const filePath = path.join(uploadsDir, filename);

            // Generate PDF
            await createClientContract(client, contractNumber, filePath);

            // Get file size
            const stats = fs.statSync(filePath);

            // Create database record
            await Contract.create({
                contract_number: contractNumber,
                filename: filename,
                original_name: `雇主合約-${client.name}.pdf`,
                category: '雇主合約',
                file_path: filePath,
                file_size: stats.size,
                mime_type: 'application/pdf',
                description: `${client.name}的雇主服務契約書`,
                client_id: client.id,
                uploaded_by: admin.id
            });

            console.log(`✅ Generated contract for ${client.name} (${contractNumber})`);
        }

        console.log(`\n🎉 Successfully generated ${clients.length} client contracts!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

generateClientContracts();
