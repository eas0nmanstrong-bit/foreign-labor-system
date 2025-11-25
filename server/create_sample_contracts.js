const { Contract, User } = require('./src/models');
const { connectDB } = require('./src/database');
const fs = require('fs');
const path = require('path');

const createSampleContracts = async () => {
    try {
        await connectDB();

        // Get admin user
        const admin = await User.findOne({ where: { username: 'adm' } });

        if (!admin) {
            console.error('Admin user not found');
            process.exit(1);
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, 'uploads/contracts');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Sample contracts data
        const sampleContracts = [
            {
                filename: '1732518000000-123456.pdf',
                original_name: '外勞勞動契約-阮文明.pdf',
                category: '勞動合約',
                description: '越南籍外勞阮文明的勞動契約書',
                file_size: 245678,
                mime_type: 'application/pdf'
            },
            {
                filename: '1732518100000-234567.pdf',
                original_name: '外勞勞動契約-瑪麗亞.pdf',
                category: '勞動合約',
                description: '菲律賓籍外勞瑪麗亞的勞動契約書',
                file_size: 198234,
                mime_type: 'application/pdf'
            },
            {
                filename: '1732518200000-345678.pdf',
                original_name: '雇主服務合約-王大明.pdf',
                category: '雇主合約',
                description: '與雇主王大明簽訂的外勞仲介服務合約',
                file_size: 312456,
                mime_type: 'application/pdf'
            },
            {
                filename: '1732518300000-456789.docx',
                original_name: '供應商合作協議-ABC人力公司.docx',
                category: '供應商合約',
                description: '與ABC人力仲介公司的合作協議',
                file_size: 156789,
                mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            },
            {
                filename: '1732518400000-567890.pdf',
                original_name: '公司員工手冊2025.pdf',
                category: '內部文件',
                description: '2025年度員工手冊',
                file_size: 523456,
                mime_type: 'application/pdf'
            },
            {
                filename: '1732518500000-678901.xlsx',
                original_name: '外勞薪資計算表.xlsx',
                category: '其他',
                description: '外勞薪資計算標準表',
                file_size: 89234,
                mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        ];

        // Create dummy files and database records
        for (const contractData of sampleContracts) {
            const filePath = path.join(uploadsDir, contractData.filename);

            // Create a dummy file with some content
            const content = `這是測試檔案: ${contractData.original_name}\n建立時間: ${new Date().toISOString()}`;
            fs.writeFileSync(filePath, content, 'utf8');

            // Create database record
            await Contract.create({
                ...contractData,
                file_path: filePath,
                uploaded_by: admin.id
            });

            console.log(`✅ Created: ${contractData.original_name}`);
        }

        console.log('\n🎉 Successfully created 6 sample contracts!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createSampleContracts();
