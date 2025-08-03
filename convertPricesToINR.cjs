const fs = require('fs');
const path = require('path');

const FILES = [
  'src/data/products.json',
  'src/data/products-m.json',
  'src/data/products-f.json',
];

const EXCHANGE_RATE = 83;
const THRESHOLD = 10000; // If price is less than this, assume it's USD and convert

function convertPrices(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertPrices);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (key === 'price' && typeof obj[key] === 'number') {
        // Only convert if price is less than threshold (to avoid double conversion)
        newObj[key] = obj[key] < THRESHOLD ? Math.round(obj[key] * EXCHANGE_RATE) : obj[key];
      } else {
        newObj[key] = convertPrices(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

FILES.forEach((file) => {
  const filePath = path.join(__dirname, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const converted = convertPrices(data);
  fs.writeFileSync(filePath, JSON.stringify(converted, null, 2), 'utf8');
  console.log(`Converted prices in ${file}`);
});

console.log('All prices converted to INR where needed!');