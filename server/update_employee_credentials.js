const { User } = require('./src/models');
const { sequelize } = require('./src/database');
const bcrypt = require('bcrypt');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const hashedPassword = await bcrypt.hash('1234', 10);

        // Update admin
        const adminUser = await User.findOne({ where: { username: 'admin' } });
        if (adminUser) {
            await adminUser.update({
                username: '0000000',
                password: hashedPassword
            });
            console.log('Updated admin: username=0000000, password=1234');
        }

        // Update other employees
        const employees = [
            { oldUsername: '王小明', newUsername: '1200001', id: 1200001 },
            { oldUsername: '李美華', newUsername: '1200002', id: 1200002 },
            { oldUsername: '張志強', newUsername: '1200003', id: 1200003 },
            { oldUsername: '陳雅婷', newUsername: '1200004', id: 1200004 },
            { oldUsername: '林建宏', newUsername: '1200005', id: 1200005 }
        ];

        for (const emp of employees) {
            const user = await User.findByPk(emp.id);
            if (user) {
                await user.update({
                    username: emp.newUsername,
                    password: hashedPassword
                });
                console.log(`Updated ${emp.oldUsername}: username=${emp.newUsername}, password=1234`);
            }
        }

        console.log('All usernames and passwords updated!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
