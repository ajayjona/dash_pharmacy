const fetch = require('node-fetch');

async function run() {
  const res = await fetch(`http://localhost:3001/api/products/00c755bb-e977-4379-bda9-83274fb70a34`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive: false })
  });
  console.log('Status:', res.status);
  console.log('Response:', await res.text());
}
run();
