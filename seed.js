const db = require('./db');

const products = ['Notebook', 'Backpack', 'Desk Lamp', 'Headphones', 'Water Bottle', 'Keyboard'];
const customers = ['Ana', 'Ben', 'Carla', 'Dan', 'Ella', 'Felix', 'Gina', 'Hugo'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

db.exec("DELETE FROM orders");

const insert = db.prepare("INSERT INTO orders (customer, product, amount, created_at) VALUES (?, ?, ?, ?)");

for (i = 1; i <= 200; i++){
    const customer = customers[randomInt(0, customers.length - 1)];
    const product = products[randomInt(0, products.length - 1)];
    const amount = randomInt(5, 200);
    const d = new Date(); 
    d.setDate(d.getDate() - randomInt(0, 29));
    const date = d.toLocaleDateString('en-CA');
    insert.run(customer, product, amount, date);
}

console.log(db.prepare('SELECT COUNT(*) AS n FROM orders').get().n);