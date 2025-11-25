const { sequelize } = require('./src/database');
const { Vendor } = require('./src/models');

const syncVendorModel = async () => {
    try {
        console.log('Syncing Vendor model...\n');

        // Sync Vendor model with alter: true to create table
        await Vendor.sync({ alter: true });

        console.log('✅ Vendor model synced successfully!');
        console.log('   - Vendor table created/updated');

    } catch (error) {
        console.error('❌ Error syncing Vendor model:', error);
    } finally {
        await sequelize.close();
    }
};

syncVendorModel();
