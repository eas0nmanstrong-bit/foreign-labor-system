const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Contract, User, Labor, Vendor, Client } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/contracts');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, Word, and Excel files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload contract
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { category, description } = req.body;

        if (!category) {
            // Delete uploaded file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Category is required' });
        }

        const contract = await Contract.create({
            filename: req.file.filename,
            original_name: req.file.originalname,
            category: category,
            file_path: req.file.path,
            file_size: req.file.size,
            mime_type: req.file.mimetype,
            description: description || null,
            uploaded_by: req.user.id
        });

        res.status(201).json({
            message: 'Contract uploaded successfully',
            contract: {
                id: contract.id,
                original_name: contract.original_name,
                category: contract.category,
                upload_date: contract.upload_date
            }
        });
    } catch (error) {
        // Delete uploaded file if database operation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error uploading contract:', error);
        res.status(500).json({ message: 'Failed to upload contract' });
    }
});

// Get all contracts
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { category } = req.query;

        const where = {};
        if (category && category !== 'all') {
            where.category = category;
        }

        const contracts = await Contract.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'Uploader',
                    attributes: ['id', 'name', 'username']
                },
                {
                    model: Labor,
                    attributes: ['id', 'worker_no', 'name_zh', 'name_en']
                },
                {
                    model: Vendor,
                    attributes: ['id', 'vendor_no', 'name', 'name_en']
                },
                {
                    model: Client,
                    attributes: ['id', 'client_no', 'name', 'contact_name']
                }
            ],
            order: [['upload_date', 'DESC']]
        });

        res.json(contracts);
    } catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({ message: 'Failed to fetch contracts' });
    }
});

// Get single contract
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id, {
            include: {
                model: User,
                as: 'Uploader',
                attributes: ['id', 'name', 'username']
            }
        });

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        res.json(contract);
    } catch (error) {
        console.error('Error fetching contract:', error);
        res.status(500).json({ message: 'Failed to fetch contract' });
    }
});

// Download contract
router.get('/:id/download', authenticateToken, async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        if (!fs.existsSync(contract.file_path)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(contract.file_path, contract.original_name);
    } catch (error) {
        console.error('Error downloading contract:', error);
        res.status(500).json({ message: 'Failed to download contract' });
    }
});

// Delete contract (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findByPk(req.user.id, {
            include: { model: require('../models').Role }
        });

        if (user.Role.name !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can delete contracts' });
        }

        const contract = await Contract.findByPk(req.params.id);

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        // Delete file from filesystem
        if (fs.existsSync(contract.file_path)) {
            fs.unlinkSync(contract.file_path);
        }

        // Delete from database
        await contract.destroy();

        res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
        console.error('Error deleting contract:', error);
        res.status(500).json({ message: 'Failed to delete contract' });
    }
});

router.post('/generate-sample', authenticateToken, async (req, res) => {
    try {
        // Run the contract generation script
        const path = require('path');
        const scriptPath = path.resolve(__dirname, '../../generate_labor_contracts.js');
        require(scriptPath);
        res.json({ message: 'Sample contracts generated successfully' });
    } catch (error) {
        console.error('Error generating sample contracts:', error);
        res.status(500).json({ message: 'Failed to generate sample contracts' });
    }
});

module.exports = router;
