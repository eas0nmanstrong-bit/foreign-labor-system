const { sequelize } = require('./src/database');
const { Menu } = require('./src/models');

const updateContractToVendorMenu = async () => {
    try {
        console.log('Updating menu from Contract to Vendor...\n');

        // Find the contract menu
        const contractMenu = await Menu.findOne({ where: { label: '合約管理' } });

        if (!contractMenu) {
            console.error('❌ Contract menu not found!');
            return;
        }

        console.log(`Found menu: ID=${contractMenu.id}, Label="${contractMenu.label}"`);

        // Update to vendor menu
        contractMenu.label = '廠商管理';
        contractMenu.path = '/vendors';
        contractMenu.permission_required = 'vendor:read';
        await contractMenu.save();

        console.log('\n✅ Successfully updated menu!');
        console.log(`   - label: 合約管理 → 廠商管理`);
        console.log(`   - path: /contracts → /vendors`);
        console.log(`   - permission: contract:read → vendor:read`);

    } catch (error) {
        console.error('❌ Error updating menu:', error);
    } finally {
        await sequelize.close();
    }
};

updateContractToVendorMenu();
