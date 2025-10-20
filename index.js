const express = require('express');
const mongoose = require('mongoose');

// mongoose.set('strictQuery', true);  

// Define schema
const userSchema = new mongoose.Schema({
   FirstName: 
  { type: String, 
    required: true },
  LastName:
   { type: String },
  Email: { type: String,
     required: true, 
     unique: true },
  jobTitle:
   { type: String },
  gender:
   { type: String },
});

const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb+srv://Ali:ali12345@cluster0.gvnrxzs.mongodb.net/')

  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('so finally Server is running fine.');
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// GET user by FirstName
app.get('/users/:FirstName', async (req, res) => {
  try {
    const user = await User.findOne({ FirstName: req.params.FirstName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
