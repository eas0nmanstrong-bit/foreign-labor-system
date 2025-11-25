const express = require('express');
const { Client, User, Labor } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all clients (with search)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { search } = req.query;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { client_no: { [Op.like]: `%${search}%` } },
                { contact_name: { [Op.like]: `%${search}%` } }
            ];
        }

        const clients = await Client.findAll({
            where: whereClause,
            include: [{ model: User, as: 'Owner', attributes: ['id', 'username', 'name'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get single client
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id, {
            include: [
                { model: User, as: 'Owner', attributes: ['id', 'username', 'name'] },
                { model: Labor } // Include Labors
            ]
        });
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create client
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Default owner to current user if not specified
        const clientData = { ...req.body, owner_id: req.body.owner_id || req.user.id };
        const client = await Client.create(clientData);
        res.status(201).json(client);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update client
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        await client.update(req.body);
        res.json(client);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete client
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        await client.destroy();
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
