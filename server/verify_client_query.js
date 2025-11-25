// const axios = require('axios');

async function checkApi() {
    try {
        // We need a token. For now, I'll try to login first or just assume I can hit it if I disable auth temporarily, 
        // but since I can't easily disable auth, I'll use the database directly to verify the include logic if I can't hit the API.
        // Actually, I can use the same logic as the route handler in a script to verify the query output.

        const { sequelize } = require('./src/database');
        const { Client, User } = require('./src/models');

        const clients = await Client.findAll({
            include: [{ model: User, as: 'Owner', attributes: ['id', 'username', 'name'] }],
            limit: 2
        });

        console.log(JSON.stringify(clients, null, 2));
        await sequelize.close();

    } catch (error) {
        console.error(error);
    }
}

checkApi();
