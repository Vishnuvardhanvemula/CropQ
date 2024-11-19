const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const testRouter = require('./routes/testRouter');
const contactRouter = require('./routes/contactRouter');
const workflowRouter = require('./routes/workflowRouter');
const errorHandler = require('./middleware/errorHandler');


dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', testRouter);
app.use('/contact', contactRouter);
app.use('/workflow', workflowRouter);

// Custom Error Handler
app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
