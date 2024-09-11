const Blog = require('../models/Blog');

// Create a new blog post
exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        console.log(req.body)
        const blog = new Blog({
            title,
            content,
            author: req.user.id,
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all blog posts (with pagination and search)
exports.getBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const query = {
            title: { $regex: search, $options: 'i' },
        };

        const blogs = await Blog.find(query)
            .populate('author', ['username', 'email'])
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', ['username', 'email']);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update a blog post (only the author can update)
exports.updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;

        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );

        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Blog post Deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};