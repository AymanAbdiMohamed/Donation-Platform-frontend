import { useAuth } from '../context/AuthContext'

/**
 * Charity Dashboard - placeholder page.
 */
function CharityDashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Charity Dashboard</h1>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </header>
      
      <p>Welcome, {user?.email}!</p>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Application Status</h2>
        <p>Your charity application status will appear here...</p>
        {/* TODO: FE1 - Charity application form / status */}
      </section>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Your Profile</h2>
        <p>Charity profile will appear here...</p>
        {/* TODO: FE3 - Charity profile component */}
      </section>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Donations Received</h2>
        <p>Donations received will appear here...</p>
        {/* TODO: FE3 - Donations received component */}
      </section>
    </div>
  )
}

export default CharityDashboard
