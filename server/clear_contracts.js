const { Contract } = require('./src/models');
const { connectDB } = require('./src/database');

const clearContracts = async () => {
    try {
        await connectDB();

        // Delete all contracts
        const count = await Contract.destroy({ where: {} });
        console.log(`✅ Deleted ${count} contracts`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

clearContracts();
