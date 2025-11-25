const { sequelize } = require('./src/database');
const { User, Client, Labor, LaborPayment, Role, Permission, Menu } = require('./src/models');
const fs = require('fs');
const path = require('path');

const exportData = async () => {
    try {
        console.log('Starting data export...');

        // Create backup directory
        const backupDir = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const exportDir = path.join(backupDir, `export_${timestamp}`);
        fs.mkdirSync(exportDir);

        // Export Users
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Don't export passwords
            include: [{ model: Role, required: false }]
        });
        fs.writeFileSync(
            path.join(exportDir, 'users.json'),
            JSON.stringify(users, null, 2)
        );
        console.log(`✓ Exported ${users.length} users`);

        // Export Clients
        const clients = await Client.findAll({
            include: [
                { model: User, as: 'Owner', attributes: ['id', 'username'], required: false }
            ]
        });
        fs.writeFileSync(
            path.join(exportDir, 'clients.json'),
            JSON.stringify(clients, null, 2)
        );
        console.log(`✓ Exported ${clients.length} clients`);

        // Export Labors
        const labors = await Labor.findAll({
            include: [
                { model: Client, attributes: ['id', 'client_no', 'name'], required: false },
                { model: User, as: 'Maintenance', attributes: ['id', 'username'], required: false }
            ]
        });
        fs.writeFileSync(
            path.join(exportDir, 'labors.json'),
            JSON.stringify(labors, null, 2)
        );
        console.log(`✓ Exported ${labors.length} labors`);

        // Export Payments
        const payments = await LaborPayment.findAll({
            include: [
                { model: Labor, attributes: ['id', 'worker_no', 'name_zh'], required: false }
            ]
        });
        fs.writeFileSync(
            path.join(exportDir, 'payments.json'),
            JSON.stringify(payments, null, 2)
        );
        console.log(`✓ Exported ${payments.length} payments`);

        // Export Roles
        const roles = await Role.findAll({
            include: [{ model: Permission, required: false }]
        });
        fs.writeFileSync(
            path.join(exportDir, 'roles.json'),
            JSON.stringify(roles, null, 2)
        );
        console.log(`✓ Exported ${roles.length} roles`);

        // Export Menus
        const menus = await Menu.findAll();
        fs.writeFileSync(
            path.join(exportDir, 'menus.json'),
            JSON.stringify(menus, null, 2)
        );
        console.log(`✓ Exported ${menus.length} menus`);

        // Create summary
        const summary = {
            exportDate: new Date().toISOString(),
            timestamp: timestamp,
            counts: {
                users: users.length,
                clients: clients.length,
                labors: labors.length,
                payments: payments.length,
                roles: roles.length,
                menus: menus.length
            }
        };
        fs.writeFileSync(
            path.join(exportDir, 'summary.json'),
            JSON.stringify(summary, null, 2)
        );

        console.log('\n========================================');
        console.log('✓ Data export completed successfully!');
        console.log(`Export location: ${exportDir}`);
        console.log('========================================\n');
        console.log('Summary:');
        console.log(`  - Users: ${summary.counts.users}`);
        console.log(`  - Clients: ${summary.counts.clients}`);
        console.log(`  - Labors: ${summary.counts.labors}`);
        console.log(`  - Payments: ${summary.counts.payments}`);
        console.log(`  - Roles: ${summary.counts.roles}`);
        console.log(`  - Menus: ${summary.counts.menus}`);

    } catch (error) {
        console.error('Error exporting data:', error);
    } finally {
        await sequelize.close();
    }
};

exportData();
