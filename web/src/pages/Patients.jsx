import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function Patients() {
  const [patients, setPatients] = useState([])
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const loadPatients = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('nutritionist_patients')
      .select('id, patient_id, profiles!nutritionist_patients_patient_id_fkey(full_name, email)')
      .eq('nutritionist_id', user.id)
      .eq('status', 'active')

    if (!error) setPatients(data)
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const handleAddPatient = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    // Buscar si existe un paciente registrado con ese correo
    const { data: foundProfile, error: searchError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('email', email)
      .eq('role', 'patient')
      .single()

    if (searchError || !foundProfile) {
      setMessage('No se encontró ningún paciente registrado con ese correo.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('nutritionist_patients')
      .insert({
        nutritionist_id: user.id,
        patient_id: foundProfile.id,
      })

    if (insertError) {
      setMessage('Error: ' + insertError.message)
      setLoading(false)
      return
    }

    setMessage(`${foundProfile.full_name} fue agregado correctamente.`)
    setEmail('')
    setLoading(false)
    loadPatients()
  }

  return (
    <div>
      <h1 className="page-title">Pacientes</h1>

      <form onSubmit={handleAddPatient} className="add-patient-form">
        <input
          type="email"
          placeholder="Correo del paciente"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Agregando...' : 'Agregar paciente'}
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}

      <div className="patients-list">
        {patients.length === 0 ? (
          <p>Aún no tienes pacientes registrados.</p>
        ) : (
          patients.map((p) => (
            <Link
              key={p.id}
              to={`/dashboard/patients/${p.patient_id}`}
              className="patient-card"
            >
              <span className="patient-name">{p.profiles.full_name}</span>
              <span className="patient-email">{p.profiles.email}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default Patients