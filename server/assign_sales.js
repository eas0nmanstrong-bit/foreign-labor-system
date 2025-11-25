const { sequelize } = require('./src/database');
const { Client, User } = require('./src/models');

async function assignSales() {
    try {
        // Get all sales staff
        const salesStaff = await User.findAll({
            where: { department: '業務部' }
        });

        if (salesStaff.length === 0) {
            console.log('No sales staff found.');
            return;
        }

        console.log(`Found ${salesStaff.length} sales staff: ${salesStaff.map(u => u.name).join(', ')}`);

        // Get all clients
        const clients = await Client.findAll();
        console.log(`Found ${clients.length} clients.`);

        // Assign random sales staff to each client
        for (const client of clients) {
            const randomStaff = salesStaff[Math.floor(Math.random() * salesStaff.length)];
            await client.update({ owner_id: randomStaff.id });
            console.log(`Assigned ${randomStaff.name} to client ${client.name}`);
        }

        console.log('Sales staff assignment completed successfully.');

    } catch (error) {
        console.error('Error assigning sales staff:', error);
    } finally {
        await sequelize.close();
    }
}

assignSales();
