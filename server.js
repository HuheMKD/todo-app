
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Task = require('./models/Task');

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.static('public'))

// konekcija do bazata
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => {
        console.error('❌ Error connecting to MongoDB Atlas:', err);
        process.exit(1);
    });

// pochetna stranica
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

// gi zemame zadachite
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error('❌ Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// dodavame zadacha
app.post('/tasks', async (req, res) => {
    try {
        const newTask = await Task.create({ title: req.body.title });
        res.status(201).json(newTask);
    } catch (error) {
        console.error('❌ Error creating task:', error);
        res.status(500).json({ error: 'Error creating task' });
    }
});


// ja brishime zadachata
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('❌ Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// start na servero
app.listen(port, () => {
    console.log('🚀 Server running on http://localhost:${port}`');
});