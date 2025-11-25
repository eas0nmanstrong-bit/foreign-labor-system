const express = require('express');
const { Labor, Client, User, LaborPayment } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const { generatePayments } = require('../services/paymentService');

const router = express.Router();

// Get all labors (with search and filter)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { search, client_id } = req.query;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name_en: { [Op.like]: `%${search}%` } },
                { name_zh: { [Op.like]: `%${search}%` } },
                { worker_no: { [Op.like]: `%${search}%` } },
                { passport_no: { [Op.like]: `%${search}%` } },
                { arc_no: { [Op.like]: `%${search}%` } }
            ];
        }

        if (client_id) {
            whereClause.client_id = client_id;
        }

        const labors = await Labor.findAll({
            where: whereClause,
            include: [
                { model: Client, attributes: ['name', 'client_no'] },
                { model: User, as: 'Maintenance', attributes: ['id', 'username', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(labors);
    } catch (error) {
        console.error('Error fetching labors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get single labor
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const labor = await Labor.findByPk(req.params.id, {
            include: [
                { model: Client, attributes: ['name', 'client_no'] },
                { model: User, as: 'Maintenance', attributes: ['id', 'username', 'name'] },
                { model: LaborPayment }
            ]
        });
        if (!labor) return res.status(404).json({ message: 'Labor not found' });
        res.json(labor);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create labor
router.post('/', authenticateToken, async (req, res) => {
    try {
        const labor = await Labor.create(req.body);
        if (labor.employment_date) {
            await generatePayments(labor.id, labor.employment_date);
        }
        res.status(201).json(labor);
    } catch (error) {
        console.error('Error creating labor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update labor
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const labor = await Labor.findByPk(req.params.id);
        if (!labor) return res.status(404).json({ message: 'Labor not found' });

        await labor.update(req.body);
        if (req.body.employment_date) {
            await generatePayments(labor.id, req.body.employment_date);
        }
        res.json(labor);
    } catch (error) {
        console.error('Error updating labor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete labor
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const labor = await Labor.findByPk(req.params.id);
        if (!labor) return res.status(404).json({ message: 'Labor not found' });

        await labor.destroy();
        res.json({ message: 'Labor deleted successfully' });
    } catch (error) {
        console.error('Error deleting labor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
