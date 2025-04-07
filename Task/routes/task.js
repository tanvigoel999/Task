const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { permit } = require('../middleware/auth')
const { body, validationResult } = require('express-validator');

// POST /tasks
router.post('/',permit('Admin', 'Manager'),
  body('title').notEmpty(),
  body('assignee').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  });

// GET /tasks (with pagination)
router.get('/', async (req, res) => {
    console.log(req.body)
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const tasks = await Task.find({ assignee: req.user._id })
    .skip(skip)
    .limit(limit)
    .populate('assignee createdBy', 'name email');

  res.json(tasks);
});

// PUT /tasks/:id
router.put('/:id',
  permit('Admin', 'Manager'),
  async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const isManager = req.user.role === 'Manager' && task.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'Admin' && !isManager) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  });

// DELETE /tasks/:id
router.delete('/:id',
  permit('Admin'),
  async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  });

module.exports = router;
