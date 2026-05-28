import fs from 'fs';

async function test() {
  const dummyBase64 = 'data:image/jpeg;base64,' + Buffer.alloc(3 * 1024 * 1024, 'a').toString('base64'); // 3MB string
  
  const payload = {
    name: "Test",
    email: "test_large_payload@example.com",
    phone: "123",
    password: "password123",
    title: "Admin",
    image: dummyBase64
  };

  const res = await fetch('http://localhost:3001/api/auth/admin/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
}

test();
