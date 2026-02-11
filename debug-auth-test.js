// Quick test script to debug auth flow
import axios from 'axios';

// Mimic frontend axios config
const api = axios.create({
  baseURL: '',  // Same as frontend
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Test login function
async function testLogin() {
  console.log('Testing login...');
  try {
    const response = await api.post('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
}

// Test register function
async function testRegister() {
  console.log('Testing register...');
  try {
    const response = await api.post('/auth/register', {
      email: 'test3@example.com',
      password: 'password123',
      role: 'donor'
    });
    console.log('Register Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register Error:', error.response?.data || error.message);
    throw error;
  }
}

// Run if script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment - run tests
  testLogin().then((data) => {
    console.log('Login SUCCESS:', data);
  }).catch((err) => {
    console.log('Login FAILED:', err.message);
  });
}

export { testLogin, testRegister, api };