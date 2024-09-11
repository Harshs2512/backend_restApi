const express = require('express');
const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.post('/', authMiddleware, createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
