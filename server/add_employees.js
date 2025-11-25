const { User, Role } = require('./src/models');
const { sequelize } = require('./src/database');
const bcrypt = require('bcrypt');

const employees = [
    { username: '王小明', role: 'Staff' },
    { username: '李美華', role: 'Staff' },
    { username: '張志強', role: 'Staff' },
    { username: '陳雅婷', role: 'Staff' },
    { username: '林建宏', role: 'Staff' }
];

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Get Staff role
        const staffRole = await Role.findOne({ where: { name: 'Staff' } });
        if (!staffRole) {
            console.error('Staff role not found!');
            return;
        }

        const hashedPassword = await bcrypt.hash('password', 10);

        for (const emp of employees) {
            const existing = await User.findOne({ where: { username: emp.username } });
            if (existing) {
                console.log(`User ${emp.username} already exists, skipping...`);
                continue;
            }

            await User.create({
                username: emp.username,
                password: hashedPassword,
                role_id: staffRole.id
            });
            console.log(`Created user: ${emp.username}`);
        }

        console.log('All employees added successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
