const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Vendor, Contract, User } = require('./src/models');
const { connectDB } = require('./src/database');

// Generate contract number
const generateContractNumber = (index) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const sequence = String(index + 1).padStart(3, '0');
    return `VC-${year}${month}-${sequence}`;
};

// Create PDF contract
const createVendorContract = (vendor, contractNumber, outputPath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Title
        doc.fontSize(20).font('Helvetica-Bold').text('供應商合作契約書', { align: 'center' });
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

        doc.fontSize(14).font('Helvetica-Bold').text('乙方（供應商）', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica');
        doc.text(`供應商編號：${vendor.vendor_no}`);
        doc.text(`供應商名稱：${vendor.name}`);
        if (vendor.name_en) doc.text(`英文名稱：${vendor.name_en}`);
        doc.text(`統一編號：${vendor.tax_id || 'N/A'}`);
        doc.text(`聯絡人：${vendor.contact_person || 'N/A'}`);
        doc.text(`聯絡電話：${vendor.phone || 'N/A'}`);
        doc.text(`地址：${vendor.address || 'N/A'}`);
        doc.moveDown(2);

        // Contract terms
        doc.fontSize(14).font('Helvetica-Bold').text('契約條款', { underline: true });
        doc.moveDown(1);

        const terms = [
            {
                title: '第一條 契約期間',
                content: '本契約自簽訂日起生效，有效期限為一年，期滿前三十日內雙方如無異議，自動續約一年。'
            },
            {
                title: '第二條 服務項目',
                content: `乙方同意提供以下服務：${vendor.service_items || '相關專業服務'}。`
            },
            {
                title: '第三條 服務品質',
                content: '乙方應確保所提供之服務符合業界標準，並維持良好品質。'
            },
            {
                title: '第四條 付款條件',
                content: '甲方應於收到乙方發票後三十日內完成付款。'
            },
            {
                title: '第五條 保密義務',
                content: '雙方對於因本契約所知悉之對方機密資訊，負有保密義務。'
            },
            {
                title: '第六條 契約終止',
                content: '任一方欲終止本契約，應於三十日前以書面通知他方。'
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
        doc.text('乙方（供應商）簽章：_______________', 300, signatureY);
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
const generateVendorContracts = async () => {
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

        // Get all vendors
        const vendors = await Vendor.findAll();

        console.log(`Found ${vendors.length} vendors`);

        for (let i = 0; i < vendors.length; i++) {
            const vendor = vendors[i];
            const contractNumber = generateContractNumber(i);
            const filename = `${contractNumber}.pdf`;
            const filePath = path.join(uploadsDir, filename);

            // Generate PDF
            await createVendorContract(vendor, contractNumber, filePath);

            // Get file size
            const stats = fs.statSync(filePath);

            // Create database record
            await Contract.create({
                contract_number: contractNumber,
                filename: filename,
                original_name: `供應商合約-${vendor.name}.pdf`,
                category: '供應商合約',
                file_path: filePath,
                file_size: stats.size,
                mime_type: 'application/pdf',
                description: `${vendor.name}的供應商合作契約書`,
                vendor_id: vendor.id,
                uploaded_by: admin.id
            });

            console.log(`✅ Generated contract for ${vendor.name} (${contractNumber})`);
        }

        console.log(`\n🎉 Successfully generated ${vendors.length} vendor contracts!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

generateVendorContracts();
