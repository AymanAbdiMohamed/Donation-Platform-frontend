console.log('🔧 Debug script loaded');

// Add global debug helpers
window.debugAuth = {
  testLogin: async () => {
    console.log('🧪 Testing login API directly...');
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      const data = await response.json();
      console.log('✅ Login API result:', data);
      return data;
    } catch (error) {
      console.error('❌ Login API error:', error);
      return error;
    }
  },

  checkLocalStorage: () => {
    console.log('💾 LocalStorage contents:');
    console.log('- access_token:', localStorage.getItem('access_token'));
    console.log('- All localStorage keys:', Object.keys(localStorage));
  },

  clearAuth: () => {
    localStorage.removeItem('access_token');
    console.log('🗑️ Auth cleared');
  },

  testNavigation: (path) => {
    console.log(`🔄 Testing navigation to: ${path}`);
    window.location.pathname = path;
  },

  checkAuthContext: () => {
    // This will only work if we're on a page with React rendered
    console.log('🔍 Checking AuthContext...');
    console.log('React DevTools would be helpful here');
  }
};

console.log('🛠️ Debug helpers available: window.debugAuth');
console.log('📋 Available commands:');
console.log('- window.debugAuth.testLogin()');
console.log('- window.debugAuth.checkLocalStorage()');
console.log('- window.debugAuth.clearAuth()');
console.log('- window.debugAuth.testNavigation("/donor")');
console.log('- window.debugAuth.checkAuthContext()');

// Auto-run some basic checks
window.debugAuth.checkLocalStorage();