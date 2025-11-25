const { sequelize } = require('./src/database');

const addUserColumns = async () => {
    try {
        console.log('Adding employee_id and name columns to Users table...\n');

        // Add employee_id column
        await sequelize.query(`
            ALTER TABLE Users ADD COLUMN employee_id VARCHAR(255);
        `).catch(err => {
            if (err.message.includes('duplicate column name')) {
                console.log('   - employee_id column already exists');
            } else {
                throw err;
            }
        });

        // Add name column
        await sequelize.query(`
            ALTER TABLE Users ADD COLUMN name VARCHAR(255);
        `).catch(err => {
            if (err.message.includes('duplicate column name')) {
                console.log('   - name column already exists');
            } else {
                throw err;
            }
        });

        console.log('✅ Columns added successfully!');

    } catch (error) {
        console.error('❌ Error adding columns:', error.message);
    } finally {
        await sequelize.close();
    }
};

addUserColumns();
