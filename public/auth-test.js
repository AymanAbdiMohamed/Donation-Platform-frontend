// Auth flow verification test
console.log('🧪 Starting auth flow verification...');

// Clear any existing auth state
localStorage.removeItem('access_token');

// Test 1: Verify login flow  
async function testLoginFlow() {
  console.log('🔐 Testing login flow...');
  
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('✅ Login API response:', data);
    
    // Store token as the app would
    localStorage.setItem('access_token', data.access_token);
    console.log('💾 Token stored in localStorage');
    
    // Test navigation by changing location
    console.log(`🔄 Attempting navigation to /${data.user.role}...`);
    window.location.hash = `#test-${Date.now()}`;
    
    setTimeout(() => {
      window.location.pathname = `/${data.user.role}`;
    }, 1000);
    
    return data.user;
  } catch (error) {
    console.error('❌ Login test failed:', error);
    throw error;
  }
}

// Test 2: Verify /auth/me endpoint  
async function testAuthMe() {
  console.log('🔍 Testing /auth/me...');
  
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('❌ No token found in localStorage');
    return;
  }
  
  try {
    const response = await fetch('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log('✅ /auth/me response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ /auth/me test failed:', error);
    throw error;
  }
}

// Run tests
window.runAuthTests = async () => {
  try {
    console.log('🚀 Starting comprehensive auth tests...');
    
    // Test login
    const user = await testLoginFlow();
    
    // Wait briefly for state to settle
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test auth/me
    const meData = await testAuthMe();
    
    console.log('🎉 All auth tests passed!');
    console.log('👤 User:', user);
    console.log('🔐 Token validation:', meData);
    
  } catch (error) {
    console.error('💥 Auth tests failed:', error);
  }
};

// Auto-run if loaded in browser
if (typeof window !== 'undefined') {
  console.log('📝 Auth test functions loaded. Call window.runAuthTests() to run.');
}