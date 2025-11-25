const { sequelize } = require('./src/database');
const { Vendor, User } = require('./src/models');

const seedVendors = async () => {
    try {
        console.log('Seeding vendor data...\n');

        // Find a user to be the owner
        const owner = await User.findOne({ where: { role_id: 1 } });

        if (!owner) {
            console.error('❌ No admin user found!');
            return;
        }

        const sampleVendors = [
            {
                vendor_no: 'V001',
                name: '環球人力仲介公司',
                name_en: 'Global Manpower Agency',
                category: 'broker',
                tax_id: '12345678',
                contact_person: '張經理',
                contact_title: '業務經理',
                phone: '02-12345678',
                mobile: '0912-345-678',
                email: 'contact@global-manpower.com',
                website: 'https://www.global-manpower.com',
                address: '台北市中正區忠孝東路一段100號10樓',
                city: '台北市',
                country: '台灣',
                service_items: JSON.stringify(['外勞仲介', '文件代辦', '翻譯服務']),
                rating: 5,
                status: 'active',
                notes: '長期合作夥伴，服務品質優良',
                owner_id: owner.id
            },
            {
                vendor_no: 'V002',
                name: '台北榮民總醫院',
                name_en: 'Taipei Veterans General Hospital',
                category: 'medical',
                contact_person: '李護理長',
                contact_title: '護理長',
                phone: '02-28712121',
                email: 'service@vghtpe.gov.tw',
                address: '台北市北投區石牌路二段201號',
                city: '台北市',
                country: '台灣',
                service_items: JSON.stringify(['健康檢查', '體檢服務', '醫療諮詢']),
                rating: 5,
                status: 'active',
                notes: '外勞體檢指定醫院',
                owner_id: owner.id
            },
            {
                vendor_no: 'V003',
                name: '新光人壽保險股份有限公司',
                name_en: 'Shin Kong Life Insurance',
                category: 'insurance',
                tax_id: '11223344',
                contact_person: '陳襄理',
                contact_title: '襄理',
                phone: '02-87726688',
                mobile: '0922-333-444',
                email: 'service@skl.com.tw',
                website: 'https://www.skl.com.tw',
                address: '台北市信義區松仁路32號',
                city: '台北市',
                country: '台灣',
                bank_name: '台北富邦銀行',
                bank_branch: '信義分行',
                bank_account: '123456789012',
                service_items: JSON.stringify(['外勞保險', '意外險', '醫療險']),
                rating: 4,
                status: 'active',
                notes: '提供外勞專屬保險方案',
                owner_id: owner.id
            },
            {
                vendor_no: 'V004',
                name: '菲律賓語翻譯服務中心',
                name_en: 'Filipino Translation Service Center',
                category: 'translation',
                contact_person: 'Maria Santos',
                contact_title: '翻譯師',
                phone: '02-23456789',
                mobile: '0933-444-555',
                email: 'maria@ftsc.com.tw',
                address: '台北市大安區復興南路一段200號',
                city: '台北市',
                country: '台灣',
                service_items: JSON.stringify(['口譯', '筆譯', '陪同翻譯']),
                rating: 4,
                status: 'active',
                notes: '專業菲律賓語翻譯',
                owner_id: owner.id
            },
            {
                vendor_no: 'V005',
                name: '勞動法律事務所',
                name_en: 'Labor Law Office',
                category: 'legal',
                tax_id: '55667788',
                contact_person: '林律師',
                contact_title: '律師',
                phone: '02-27654321',
                email: 'lawyer.lin@laborlaw.com.tw',
                address: '台北市松山區民生東路三段100號8樓',
                city: '台北市',
                country: '台灣',
                service_items: JSON.stringify(['勞動法諮詢', '契約審查', '爭議處理']),
                rating: 5,
                status: 'active',
                notes: '專精外勞相關法律事務',
                owner_id: owner.id
            },
            {
                vendor_no: 'V006',
                name: '印尼職業訓練中心',
                name_en: 'Indonesian Vocational Training Center',
                category: 'training',
                contact_person: 'Budi Santoso',
                contact_title: '主任',
                phone: '02-29876543',
                email: 'info@ivtc.com.tw',
                address: '新北市中和區中山路二段300號',
                city: '新北市',
                country: '台灣',
                service_items: JSON.stringify(['語言訓練', '技能培訓', '文化適應課程']),
                rating: 4,
                status: 'active',
                notes: '提供印尼外勞來台前訓練',
                owner_id: owner.id
            },
            {
                vendor_no: 'V007',
                name: '安心住宿管理公司',
                name_en: 'Safe Stay Management',
                category: 'accommodation',
                tax_id: '99887766',
                contact_person: '黃經理',
                contact_title: '總經理',
                phone: '02-26543210',
                mobile: '0955-666-777',
                email: 'service@safestay.com.tw',
                address: '新北市板橋區文化路一段150號',
                city: '新北市',
                country: '台灣',
                service_items: JSON.stringify(['宿舍管理', '清潔服務', '設施維護']),
                rating: 3,
                status: 'active',
                notes: '提供外勞宿舍管理服務',
                owner_id: owner.id
            },
            {
                vendor_no: 'V008',
                name: '越南人力資源公司',
                name_en: 'Vietnam Human Resources Co.',
                category: 'broker',
                contact_person: 'Nguyen Van A',
                phone: '+84-24-12345678',
                email: 'contact@vnhr.com.vn',
                address: 'Hanoi, Vietnam',
                city: 'Hanoi',
                country: '越南',
                service_items: JSON.stringify(['外勞招募', '文件處理', '行前訓練']),
                rating: 4,
                status: 'active',
                notes: '越南當地合作仲介',
                owner_id: owner.id
            }
        ];

        for (const vendorData of sampleVendors) {
            const existing = await Vendor.findOne({ where: { vendor_no: vendorData.vendor_no } });
            if (!existing) {
                await Vendor.create(vendorData);
                console.log(`✓ Created vendor: ${vendorData.name}`);
            } else {
                console.log(`- Vendor ${vendorData.name} already exists`);
            }
        }

        const count = await Vendor.count();
        console.log(`\n✅ Seeding completed. Total vendors in DB: ${count}`);

    } catch (error) {
        console.error('❌ Error seeding vendors:', error);
    } finally {
        await sequelize.close();
    }
};

seedVendors();
