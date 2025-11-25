const { sequelize } = require('./src/database');
const { User } = require('./src/models');

const syncUserModel = async () => {
    try {
        console.log('Syncing User model to add employee_id and name columns...\n');

        // Sync only the User model with alter: true to add new columns
        await User.sync({ alter: true });

        console.log('✅ User model synced successfully!');
        console.log('   - Added column: employee_id');
        console.log('   - Added column: name');

    } catch (error) {
        console.error('❌ Error syncing model:', error);
    } finally {
        await sequelize.close();
    }
};

syncUserModel();
