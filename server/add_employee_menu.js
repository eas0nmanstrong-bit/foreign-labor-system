const { Menu } = require('./src/models');
const { sequelize } = require('./src/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const existingMenu = await Menu.findOne({ where: { path: '/employees' } });
        if (!existingMenu) {
            await Menu.create({
                label: '員工管理',
                path: '/employees',
                icon: 'UserGroup', // Assuming UserGroup icon exists or similar
                permission_required: 'admin:access', // Only admin can see
                order: 5
            });
            console.log('Employee menu added.');
        } else {
            console.log('Employee menu already exists.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
