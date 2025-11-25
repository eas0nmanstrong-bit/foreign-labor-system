const { sequelize } = require('./database');
const { Client, Labor } = require('./models');

const seedLabors = async () => {
    try {
        // Ensure Labor table exists and update schema
        await Labor.sync({ alter: true });

        // Clear existing labors to avoid unique constraint errors
        await Labor.destroy({ where: {}, truncate: true });

        const clients = await Client.findAll();

        if (clients.length === 0) {
            console.log('No clients found. Please seed clients first.');
            return;
        }

        console.log(`Found ${clients.length} clients. Starting labor seeding...`);

        for (const client of clients) {
            let laborCount = 0;

            // Determine labor count based on industry (proxy for Natural vs Legal)
            if (client.industry === '家庭看護') {
                laborCount = 1;
            } else {
                // Legal entity: 5-10 labors
                laborCount = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
            }

            console.log(`Seeding ${laborCount} labors for client: ${client.name} (${client.industry})`);

            for (let i = 0; i < laborCount; i++) {
                const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

                await Labor.create({
                    worker_no: `W${client.client_no}-${i + 1}`,
                    name_en: `WORKER ${client.client_no} ${i + 1}`,
                    name_zh: `外勞 ${client.client_no} ${i + 1}`,
                    passport_no: `P${randomId}${i}`,
                    entry_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
                    arc_no: `ARC${randomId}${i}`,
                    arc_expiry_date: new Date(Date.now() + Math.floor(Math.random() * 10000000000)),
                    employment_date: new Date(),
                    client_id: client.id,
                    maintenance_id: client.owner_id // Default to client's owner
                });
            }
        }

        const totalLabors = await Labor.count();
        console.log(`Seeding completed. Total labors in DB: ${totalLabors}`);

    } catch (error) {
        console.error('Error seeding labors:', error);
    }
};

seedLabors();
