import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Register page.
 */
function Register() {
  const navigate = useNavigate()
  const { register, error, loading, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
  })
  const [validationError, setValidationError] = useState('')

  const handleChange = (e) => {
    clearError()
    setValidationError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }
    
    try {
      const user = await register(formData.email, formData.password, formData.role)
      
      // Navigate to dashboard based on role
      const dashboards = {
        donor: '/donor/dashboard',
        charity: '/charity/dashboard',
        admin: '/admin/dashboard',
      }
      navigate(dashboards[user.role] || '/donor/dashboard')
    } catch (err) {
      // Error handled by context
    }
  }

  const displayError = validationError || error

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Register</h1>
      
      {displayError && <div style={{ color: 'red', marginBottom: '10px' }}>{displayError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="role">I want to:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="donor">Donate to charities</option>
            <option value="charity">Register as a charity</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Register
