const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const blogRoutes = require('./routes/blogRoute');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const limiter = require('./middleware/limiter');
require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());
const corsOptions = {
    origin: '*', // Replace with your allowed domain(s)
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));