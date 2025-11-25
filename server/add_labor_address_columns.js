const { sequelize } = require('./src/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const queryInterface = sequelize.getQueryInterface();

        try {
            await queryInterface.addColumn('Labors', 'residence_address', {
                type: require('sequelize').DataTypes.STRING
            });
            console.log('Added residence_address column.');
        } catch (e) {
            console.log('residence_address column might already exist or error:', e.message);
        }

        try {
            await queryInterface.addColumn('Labors', 'lease_id', {
                type: require('sequelize').DataTypes.INTEGER
            });
            console.log('Added lease_id column.');
        } catch (e) {
            console.log('lease_id column might already exist or error:', e.message);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
