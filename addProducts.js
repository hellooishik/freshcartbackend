const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const products = [
  // Category: Raw Eggs (10 Pieces per Box)
  {
    name: 'Fresh Eggs',
    description: 'Organic farm eggs, free-range and fresh.',
    price: 10,
    category: '67da7cbb69a1aaceed621d78',
    stock: 0,
    image: '../freshcartBackend/uploads/1742300947580-PDP_1._Classic_Eggs_-_Pack_of_6_(1).jpg',
    variations: [
      { type: '1 Box (10 pcs)', price: 10, discount: 0 },
      { type: '2 Box (20 pcs)', price: 18, discount: 10 }
    ]
  },
  {
    name: 'Organic Brown Eggs',
    description: 'Nutrient-rich brown eggs, pasture-raised.',
    price: 12,
    category: '67da7cbb69a1aaceed621d78',
    stock: 15,
    image: '../freshcartBackend/uploads/organic_brown_eggs.jpg',
    variations: [
      { type: '1 Box (10 pcs)', price: 12, discount: 0 },
      { type: '2 Box (20 pcs)', price: 22, discount: 8 }
    ]
  },

  // Category: Fresh Chicken (350g, 500g, 1Kg)
  {
    name: 'Fresh Chicken',
    description: 'Organic chicken, hormone-free and locally sourced.',
    price: 120,
    category: '67da7d8969a1aaceed621d7f',
    stock: 0,
    image: '../freshcartBackend/uploads/1742301098527-1716979980129.png',
    variations: [
      { type: '350g', price: 50, discount: 0 },
      { type: '500g', price: 80, discount: 5 },
      { type: '1Kg', price: 150, discount: 10 }
    ]
  },
  {
    name: 'Boneless Chicken Breast',
    description: 'Lean and protein-packed chicken breast.',
    price: 180,
    category: '67da7d8969a1aaceed621d7f',
    stock: 12,
    image: '../freshcartBackend/uploads/boneless_chicken.jpg',
    variations: [
      { type: '350g', price: 70, discount: 0 },
      { type: '500g', price: 100, discount: 5 },
      { type: '1Kg', price: 180, discount: 10 }
    ]
  },

  // Category: Fresh Fish (350g, 500g, 1Kg)
  {
    name: 'Fresh Fish',
    description: 'Wild-caught salmon, rich in omega-3.',
    price: 160,
    category: '67da7db369a1aaceed621d81',
    stock: 0,
    image: '../freshcartBackend/uploads/1742301042876-1741328790378.jpg',
    variations: [
      { type: '350g', price: 60, discount: 0 },
      { type: '500g', price: 100, discount: 5 },
      { type: '1Kg', price: 180, discount: 10 }
    ]
  },
  {
    name: 'Tilapia Fish',
    description: 'Fresh farm-raised tilapia, mild and delicious.',
    price: 80,
    category: '67da7db369a1aaceed621d81',
    stock: 20,
    image: '../freshcartBackend/uploads/tilapia_fish.jpg',
    variations: [
      { type: '350g', price: 40, discount: 0 },
      { type: '500g', price: 70, discount: 5 },
      { type: '1Kg', price: 130, discount: 10 }
    ]
  },

  // Category: Mutton (350g, 500g, 1Kg)
  {
    name: 'Fresh Mutton',
    description: 'Premium quality fresh mutton, sourced from local farms.',
    price: 600,
    category: '67dbfb29cc743be58da91dd3',
    stock: 0,
    image: '../freshcartBackend/uploads/1742470457022-chinken.png',
    variations: [
      { type: '350g', price: 220, discount: 0 },
      { type: '500g', price: 300, discount: 5 },
      { type: '1Kg', price: 600, discount: 10 }
    ]
  }
];

const uploadProducts = async () => {
  try {
    for (const product of products) {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('category', product.category);
      formData.append('stock', product.stock);
      formData.append('variations', JSON.stringify(product.variations));

      const imagePath = path.resolve(__dirname, product.image);
      if (fs.existsSync(imagePath)) {
        formData.append('image', fs.createReadStream(imagePath));
      } else {
        console.error(`❌ Image not found: ${imagePath}`);
        continue;
      }

      const response = await axios.post('http://localhost:4000/products', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      console.log(`✅ Product uploaded: ${response.data.name}`);
    }
  } catch (error) {
    console.error('❌ Error uploading products:', error.response?.data?.msg || error.message);
  }
};

uploadProducts();
