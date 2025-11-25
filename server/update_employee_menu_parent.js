const { sequelize } = require('./src/database');
const { Menu } = require('./src/models');

const updateEmployeeMenuParent = async () => {
    try {
        console.log('Updating employee menu to be a child of system management...\n');

        // Find the employee menu
        const employeeMenu = await Menu.findOne({ where: { label: '員工管理' } });

        if (!employeeMenu) {
            console.error('❌ Employee menu not found!');
            return;
        }

        // Find the system management menu
        const systemMenu = await Menu.findOne({ where: { label: '系統管理' } });

        if (!systemMenu) {
            console.error('❌ System management menu not found!');
            return;
        }

        console.log(`Found employee menu: ID=${employeeMenu.id}, Label="${employeeMenu.label}"`);
        console.log(`Found system menu: ID=${systemMenu.id}, Label="${systemMenu.label}"`);

        // Update employee menu to be a child of system menu
        employeeMenu.parent_id = systemMenu.id;
        employeeMenu.order = 1; // First item under system management
        await employeeMenu.save();

        console.log('\n✅ Successfully updated employee menu!');
        console.log(`   - parent_id: null → ${systemMenu.id}`);
        console.log(`   - order: ${employeeMenu.order}`);
        console.log('\nEmployee management is now a submenu of System Management.');

    } catch (error) {
        console.error('❌ Error updating menu:', error);
    } finally {
        await sequelize.close();
    }
};

updateEmployeeMenuParent();
