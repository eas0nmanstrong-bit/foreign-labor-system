const { sequelize } = require('./src/database');
const { User, Labor } = require('./src/models');

const assignMaintenanceStaff = async () => {
    try {
        console.log('Starting maintenance staff assignment...');

        // 1. Get all maintenance users
        const maintenanceUsers = await User.findAll({
            where: { department: '維護部' }
        });

        if (maintenanceUsers.length === 0) {
            console.error('No maintenance users found!');
            return;
        }

        console.log(`Found ${maintenanceUsers.length} maintenance users:`);
        maintenanceUsers.forEach(u => console.log(`- ${u.name} (${u.id})`));

        // 2. Get all labors
        const labors = await Labor.findAll();
        console.log(`Found ${labors.length} labors.`);

        // 3. Assign random maintenance user to each labor
        for (const labor of labors) {
            const randomUser = maintenanceUsers[Math.floor(Math.random() * maintenanceUsers.length)];
            await labor.update({ maintenance_id: randomUser.id });
            console.log(`Assigned ${randomUser.name} to labor ${labor.name_zh || labor.name_en}`);
        }

        console.log('✅ Assignment completed successfully!');

    } catch (error) {
        console.error('❌ Error assigning maintenance staff:', error);
    } finally {
        await sequelize.close();
    }
};

assignMaintenanceStaff();
