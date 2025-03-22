const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

//  site zadachi
router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// new task
router.post('/', async (req, res) => {
    const { text } = req.body;
    const newTask = new Task({ text });
    await newTask.save();
    res.status(201).json(newTask);
});

// delete task
router.delete('/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

module.exports = router;