const { sequelize } = require('./src/database');
const { User } = require('./src/models');

const updateEmployee = async () => {
    try {
        console.log('Updating employee 1200006...');

        const user = await User.findOne({ where: { username: '1200006' } });

        if (!user) {
            console.error('User 1200006 not found!');
            return;
        }

        await user.update({
            employee_id: '1200006',
            name: '黃淑芬',
            department: '業務部',
            position: '專員',
            email: 'shufen@company.com',
            phone: '0912345678',
            hire_date: new Date()
        });

        console.log('✅ Employee updated successfully!');
        console.log('Name:', user.name);
        console.log('Department:', user.department);

    } catch (error) {
        console.error('❌ Error updating employee:', error);
    } finally {
        await sequelize.close();
    }
};

updateEmployee();
