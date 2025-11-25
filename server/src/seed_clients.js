const { sequelize } = require('./database');
const { Client, User, Labor } = require('./models');

const seedMoreClients = async () => {
    try {
        // Find a staff user to be the owner
        const staffUser = await User.findOne({ where: { username: 'staff' } });
        if (!staffUser) {
            console.error('Staff user not found!');
            return;
        }

        // Clear existing data (Labors first due to FK)
        await Labor.destroy({ where: {}, truncate: true });
        await Client.destroy({ where: {}, truncate: true });

        const clientsData = [
            // Natural Persons (A prefix)
            { client_no: 'A001', name: '王大明', tax_id: 'A123456789', contact_name: '王大明', phone: '0911111111', address: '台北市信義區', industry: '家庭看護', dept_code: '' },
            { client_no: 'A002', name: '李小美', tax_id: 'B223456789', contact_name: '李小美', phone: '0922222222', address: '新北市板橋區', industry: '家庭看護', dept_code: '' },

            // Legal Entities (B prefix)
            { client_no: 'B001', name: '宏達電', tax_id: '12345679', contact_name: '李經理', phone: '0911111111', address: '新北市新店區', industry: '製造業', dept_code: 'RD-01' },
            { client_no: 'B002', name: '聯發科', tax_id: '12345680', contact_name: '陳特助', phone: '0922222222', address: '新竹科學園區', industry: '製造業', dept_code: 'IC-02' },
            { client_no: 'B003', name: '中華電信', tax_id: '12345681', contact_name: '林科長', phone: '0933333333', address: '台北市中正區', industry: '服務業', dept_code: 'TEL-03' },
            { client_no: 'B004', name: '富邦金控', tax_id: '12345682', contact_name: '黃襄理', phone: '0944444444', address: '台北市大安區', industry: '金融業', dept_code: 'FIN-04' },
            { client_no: 'B005', name: '長榮海運', tax_id: '12345683', contact_name: '吳船長', phone: '0955555555', address: '桃園市蘆竹區', industry: '運輸業', dept_code: 'SEA-05' },
            { client_no: 'B006', name: '統一企業', tax_id: '12345684', contact_name: '蔡店長', phone: '0966666666', address: '台南市永康區', industry: '食品業', dept_code: 'FOOD-06' },
            { client_no: 'B007', name: '中鋼', tax_id: '12345685', contact_name: '鄭廠長', phone: '0977777777', address: '高雄市小港區', industry: '製造業', dept_code: 'STEEL-07' },
            { client_no: 'B008', name: '台塑', tax_id: '12345686', contact_name: '王組長', phone: '0988888888', address: '台北市松山區', industry: '石化業', dept_code: 'CHEM-08' },
            { client_no: 'B009', name: '國泰人壽', tax_id: '12345687', contact_name: '劉主任', phone: '0999999999', address: '台北市大安區', industry: '保險業', dept_code: 'INS-09' },
            { client_no: 'B010', name: '華碩電腦', tax_id: '12345688', contact_name: '施經理', phone: '0900000000', address: '台北市北投區', industry: '科技業', dept_code: 'PC-10' },
        ];

        for (const data of clientsData) {
            const exists = await Client.findOne({ where: { client_no: data.client_no } });
            if (!exists) {
                await Client.create({ ...data, owner_id: staffUser.id });
                console.log(`Created client: ${data.name}`);
            } else {
                console.log(`Client ${data.name} already exists.`);
            }
        }

        const count = await Client.count();
        console.log(`Total clients in DB: ${count}`);

    } catch (error) {
        console.error('Error seeding clients:', error);
    }
};

seedMoreClients();
