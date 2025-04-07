const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/task');

const app = express();
app.use(express.json());

mongoose.connect('');

app.use('/tasks', taskRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
