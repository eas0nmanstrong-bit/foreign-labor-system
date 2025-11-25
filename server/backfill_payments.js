const { generatePayments } = require('./src/services/paymentService');
const { Labor, LaborPayment } = require('./src/models');
const { sequelize } = require('./src/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const labors = await Labor.findAll({
            where: {
                employment_date: {
                    [require('sequelize').Op.ne]: null
                }
            }
        });

        console.log(`Found ${labors.length} labors with employment date.`);

        for (const labor of labors) {
            console.log(`Processing Labor: ${labor.worker_no} (${labor.name_zh})`);
            await generatePayments(labor.id, labor.employment_date);
        }

        console.log('Backfill completed.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
