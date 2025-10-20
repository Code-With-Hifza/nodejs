require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.log(" MongoDB Connection Error:", err.message));

// Home route
app.get('/', (req, res) => {
    res.send('nodemongodb  API is running');
});
app.post('/posts', async (req, res) => {
  console.log('Received body:', req.body);
  try {
    const newPost = new Post(req.body);
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log('Error:', err.message);
    res.status(400).json({ error: err.message });
  }
});



// Get all posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// Get single post by ID
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete post by ID
app.delete('/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
});
