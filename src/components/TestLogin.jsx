import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function TestLogin() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [status, setStatus] = useState('');
  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleTest = async () => {
    setStatus('Testing login...');
    
    try {
      console.log('🧪 TEST: Starting login test...');
      
      // Test 1: Call login function
      console.log('🧪 TEST: Calling login function...');
      const user = await login(email, password);
      console.log('🧪 TEST: Login function returned:', user);
      
      // Test 2: Check if user has role
      if (!user || !user.role) {
        throw new Error('User or role is missing from login response');
      }
      
      // Test 3: Get redirect path
      const redirectPath = getRedirectPath(user.role);
      console.log('🧪 TEST: Redirect path:', redirectPath);
      
      // Test 4: Try navigation
      console.log('🧪 TEST: Attempting navigation...');
      navigate(redirectPath);
      
      setStatus(`✅ Success! Should redirect to ${redirectPath}`);
      
    } catch (error) {
      console.error('🧪 TEST: Failed:', error);
      setStatus(`❌ Failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Auth Test Component</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', margin: '5px 0' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', margin: '5px 0' }}
        />
      </div>
      
      <button 
        onClick={handleTest}
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Login
      </button>
      
      {status && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}

export default TestLogin;