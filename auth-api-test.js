// Simple test of auth API functions
import { loginUser, registerUser } from './src/api/auth.js';

console.log('Testing auth API functions...');

// Test login
window.testLoginAPI = async () => {
  try {
    console.log('Testing login API...');
    const result = await loginUser({
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login success:', result);
    return result;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Test register
window.testRegisterAPI = async () => {
  try {
    console.log('Testing register API...');
    const result = await registerUser({
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'donor'
    });
    console.log('Register success:', result);
    return result;
  } catch (error) {
    console.error('Register failed:', error);
    throw error;
  }
};

console.log('Auth API test functions loaded. Call window.testLoginAPI() or window.testRegisterAPI()');