const { Labor, LaborPayment } = require('./src/models');
const { sequelize } = require('./src/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        const labor = await Labor.findByPk(1, {
            include: [{ model: LaborPayment }]
        });

        if (labor) {
            console.log(`Labor 1: ${labor.name_zh}`);
            console.log(`Payment Count: ${labor.LaborPayments.length}`);
            if (labor.LaborPayments.length > 0) {
                console.log('First Payment:', labor.LaborPayments[0].dataValues);
            }
        } else {
            console.log('Labor 1 not found');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
