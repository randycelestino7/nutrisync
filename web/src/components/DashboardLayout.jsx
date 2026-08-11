import { useState, useEffect } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../Dashboard.css'

function DashboardLayout() {
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    loadProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">NutriSync</div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className="sidebar-link">
            Inicio
          </NavLink>
          {profile?.role === 'nutritionist' && (
            <NavLink to="/dashboard/patients" className="sidebar-link">
              Pacientes
            </NavLink>
          )}
          {profile?.role === 'patient' && (
            <NavLink to="/dashboard/my-plan" className="sidebar-link">
              Mi Plan
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          {profile && (
            <div className="sidebar-user">
              <span className="sidebar-user-name">{profile.full_name}</span>
              <span className="sidebar-user-role">
                {profile.role === 'nutritionist' ? 'Nutriólogo' : 'Paciente'}
              </span>
            </div>
          )}
          <button onClick={handleLogout} className="sidebar-logout">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout