import { useAuth } from '../context/AuthContext'

/**
 * Donor Dashboard - placeholder page.
 */
function DonorDashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Donor Dashboard</h1>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </header>
      
      <p>Welcome, {user?.email}!</p>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Browse Charities</h2>
        <p>Charities list will appear here...</p>
        {/* TODO: FE3 - Charity list component */}
      </section>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Your Donations</h2>
        <p>Your donation history will appear here...</p>
        {/* TODO: FE3 - Donation history component */}
      </section>
    </div>
  )
}

export default DonorDashboard
