const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./database');
const { User } = require('./models');

const authRoutes = require('./routes/auth');
const systemRoutes = require('./routes/system');
const clientRoutes = require('./routes/clients');
const laborRoutes = require('./routes/labors');
const userRoutes = require('./routes/users');
const vendorRoutes = require('./routes/vendors');
const contractRoutes = require('./routes/contracts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/labors', laborRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/contracts', contractRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Foreign Labor Agency System API is running.');
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        // Sync models
        await sequelize.sync();

        // Auto-seed if database is empty
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('Database is empty, running auto-seed...');
            const { Role } = require('./models');
            const bcrypt = require('bcrypt');

            const adminRole = await Role.create({ name: 'Admin', description: 'Administrator' });
            await Role.create({ name: 'Staff', description: 'Staff' });

            const adminPassword = await bcrypt.hash('1234', 10);
            await User.create({
                username: 'adm',
                password: adminPassword,
                role_id: adminRole.id
            });
            console.log('Auto-seed completed. Account: adm / 1234');
        }

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
