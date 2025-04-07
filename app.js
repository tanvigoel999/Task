const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/task');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://tanvigoyal650:nppl2IHIMvyGVLlW@cluster0.lxhskb6.mongodb.net/');

app.use('/tasks', taskRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
