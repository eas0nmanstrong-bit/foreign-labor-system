const { sequelize } = require('./src/database');
const { Contract } = require('./src/models');

const resetContracts = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        // Drop and recreate the Contracts table
        await Contract.sync({ force: true });

        console.log('✅ Contracts table reset successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetContracts();
