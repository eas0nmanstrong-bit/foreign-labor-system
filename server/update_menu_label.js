const { sequelize } = require('./src/database');
const { Menu } = require('./src/models');

async function updateMenuLabel() {
    try {
        const menu = await Menu.findOne({ where: { label: '儀表板' } });
        if (menu) {
            await menu.update({ label: '內部公告' });
            console.log('Menu label updated successfully to 內部公告');
        } else {
            console.log('Menu item "儀表板" not found.');
        }
    } catch (error) {
        console.error('Error updating menu label:', error);
    } finally {
        await sequelize.close();
    }
}

updateMenuLabel();
