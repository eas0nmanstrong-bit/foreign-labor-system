const { generatePayments } = require('./src/services/paymentService');
const { Labor, LaborPayment } = require('./src/models');
const { sequelize } = require('./src/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const laborId = 1;
        const labor = await Labor.findByPk(laborId);

        if (!labor) {
            console.log('Labor 1 not found.');
            return;
        }

        console.log(`Generating payments for Labor ${labor.worker_no} (Employment Date: ${labor.employment_date})`);

        // Force delete existing payments for testing
        await LaborPayment.destroy({ where: { labor_id: laborId } });

        await generatePayments(laborId, labor.employment_date);

        const count = await LaborPayment.count({ where: { labor_id: laborId } });
        console.log(`Generated ${count} payment records.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
