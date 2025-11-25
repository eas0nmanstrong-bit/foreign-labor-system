const { sequelize } = require('./src/database');
const { Contract } = require('./src/models');

const syncContractTable = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        // Alter table to add new columns
        await Contract.sync({ alter: true });

        console.log('✅ Contract table synced successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

syncContractTable();
