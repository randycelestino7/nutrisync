import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

function RoleRoute({ children, allowedRole }) {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      setRole(data?.role)
      setLoading(false)
    }
    checkRole()
  }, [])

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando...</p>
  }

  if (role !== allowedRole) {
    return <Navigate to="/dashboard" />
  }

  return children
}

export default RoleRoute 