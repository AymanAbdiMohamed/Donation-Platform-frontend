import { useAuth } from '../context/AuthContext'

/**
 * Admin Dashboard - placeholder page.
 */
function AdminDashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </header>
      
      <p>Welcome, Admin {user?.email}!</p>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Pending Applications</h2>
        <p>Charity applications awaiting review will appear here...</p>
        {/* TODO: FE2 - Admin approval UI */}
      </section>
      
      <section style={{ marginTop: '30px' }}>
        <h2>All Charities</h2>
        <p>List of all charities will appear here...</p>
        {/* TODO: FE3 - Charities management list */}
      </section>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Platform Stats</h2>
        <p>Platform statistics will appear here...</p>
        {/* TODO: Stats dashboard */}
      </section>
    </div>
  )
}

export default AdminDashboard
