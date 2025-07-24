const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/webstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
}));

async function seed() {
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'T-shirt', description: 'Comfortable cotton t-shirt', price: 19.99 },
    { name: 'Jeans', description: 'Stylish blue jeans', price: 49.99 },
    { name: 'Sneakers', description: 'Running sneakers', price: 69.99 },
  ]);
  console.log('Database seeded!');
  process.exit();
}

seed(); 