const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/webstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  name: String,
  address: String,
  items: Array,
  createdAt: { type: Date, default: Date.now },
}));

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: {
    type: String,
    required: true,
  },
  hashedPassword: String,
}));

// Products API
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send('Not found');
  res.json(product);
});

// Orders API
app.post('/api/orders', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ success: true });
});
app.post('/api/signup', async (req , res) => {
  const {email , password} = req.body;
  const user = await User.findOne({email});
  if(user){return res.status(400).json({error: 'User already exists'})}
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({email, password: hashedPassword});
  res.status(201).json({success: true , user: newUser});
});
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log('Login attempt:', email, !!user);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  const ifMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', ifMatch);
  if (!ifMatch) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  res.json({ success: true, user });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 