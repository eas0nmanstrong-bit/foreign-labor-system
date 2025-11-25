const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./database');

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
    await connectDB();
    // Sync models (we will add this later)
    // await sequelize.sync({ force: false }); 

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();
