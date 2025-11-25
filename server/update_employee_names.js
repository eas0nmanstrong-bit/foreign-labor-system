const { sequelize } = require('./src/database');
const { User } = require('./src/models');

const updateEmployeeData = async () => {
    try {
        console.log('Updating employee data...\n');

        // 1. Update Admin user (find by role_id since username might already be changed)
        const adminUser = await User.findOne({ where: { role_id: 1 } });

        if (adminUser) {
            // Update admin credentials
            adminUser.employee_id = 'adm';
            adminUser.name = 'ADM';
            adminUser.username = 'adm';
            await adminUser.save();
            console.log('✅ Updated Admin:');
            console.log(`   - username: ${adminUser.username === 'adm' ? 'already adm' : '→ adm'}`);
            console.log(`   - employee_id: → adm`);
            console.log(`   - name: → ADM`);
        } else {
            console.log('❌ Admin user not found!');
        }

        // 2. Update staff employees with names
        const staffUpdates = [
            { username: '1200001', employee_id: '1200001', name: '王小明' },
            { username: '1200002', employee_id: '1200002', name: '李美華' },
            { username: '1200003', employee_id: '1200003', name: '張志強' },
            { username: '1200004', employee_id: '1200004', name: '陳雅婷' },
            { username: '1200005', employee_id: '1200005', name: '林建宏' }
        ];

        console.log('\n✅ Updating staff employees:');
        for (const update of staffUpdates) {
            const user = await User.findOne({ where: { username: update.username } });
            if (user) {
                user.employee_id = update.employee_id;
                user.name = update.name;
                await user.save();
                console.log(`   - ${update.username}: name → ${update.name}`);
            } else {
                console.log(`   ❌ User ${update.username} not found!`);
            }
        }

        console.log('\n========================================');
        console.log('✅ Employee data updated successfully!');
        console.log('========================================');

        // Display summary
        const allUsers = await User.findAll({
            attributes: ['id', 'username', 'employee_id', 'name', 'role_id'],
            order: [['id', 'ASC']]
        });

        console.log('\nCurrent employee list:');
        console.log('ID\tUsername\tEmployee ID\tName');
        console.log('─'.repeat(60));
        allUsers.forEach(user => {
            console.log(`${user.id}\t${user.username}\t\t${user.employee_id || 'N/A'}\t\t${user.name || 'N/A'}`);
        });

    } catch (error) {
        console.error('❌ Error updating employee data:', error);
    } finally {
        await sequelize.close();
    }
};

updateEmployeeData();
