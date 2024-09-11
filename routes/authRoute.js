const express = require('express');
const { register, login } = require('../controllers/authController');
const passwordValidation = require('../middleware/passwordValidation')
const router = express.Router();
const { check, validationResult } = require('express-validator');

router.post('/register',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
        passwordValidation,
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        register(req, res);
    }
);
router.post('/login', login);

module.exports = router;
