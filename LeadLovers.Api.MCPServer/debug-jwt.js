// Debug script to decode JWT token
const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmFtb24iLCJpYXQiOjE3NTc2MTEwMjcsImV4cCI6MTc1NzY5NzQyNywic3ViIjoiNTUxNDI2NSJ9.PhlUT4Yp-I64LTdaWuNCQtP_i81qNiPxvm-ShT4c7vI';

console.log('=== NEW TOKEN ===');
const token = newToken;

// Decode header
const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
console.log('JWT Header:', header);

// Decode payload
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
console.log('JWT Payload:', payload);

// Convert timestamps
if (payload.iat) {
  console.log('Issued at:', new Date(payload.iat * 1000));
}
if (payload.exp) {
  console.log('Expires at:', new Date(payload.exp * 1000));
}

// Check if expired
const now = Math.floor(Date.now() / 1000);
console.log('Current time:', new Date());
console.log('Is expired?', payload.exp < now);

console.log('User ID:', payload.uid);