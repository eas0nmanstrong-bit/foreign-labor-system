const { sequelize } = require('./src/database');
const { LaborPayment } = require('./src/models');

const syncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync only LaborPayment table or use alter
        await LaborPayment.sync({ alter: true });
        console.log('LaborPayment table synced.');

    } catch (error) {
        console.error('Error syncing DB:', error);
    } finally {
        await sequelize.close();
    }
};

syncDB();
