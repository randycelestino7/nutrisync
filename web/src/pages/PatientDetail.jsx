import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function PatientDetail() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [plan, setPlan] = useState(null)
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    const { data: patientData } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', id)
      .single()
    setPatient(patientData)

    const { data: { user } } = await supabase.auth.getUser()

    const { data: planData } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('patient_id', id)
      .eq('nutritionist_id', user.id)
      .eq('status', 'active')
      .single()

    setPlan(planData)
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    // Si ya existe un plan activo, lo desactivamos antes de crear el nuevo
    if (plan) {
      await supabase
        .from('meal_plans')
        .update({ status: 'inactive' })
        .eq('id', plan.id)
    }

    const { error } = await supabase.from('meal_plans').insert({
      patient_id: id,
      nutritionist_id: user.id,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
    })

    if (error) {
      setMessage('Error: ' + error.message)
      setLoading(false)
      return
    }

    setMessage('Plan guardado correctamente.')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFats('')
    setLoading(false)
    loadData()
  }

  if (!patient) return <p>Cargando...</p>

  return (
    <div>
      <Link to="/dashboard/patients" className="back-link">
        ← Volver a Pacientes
      </Link>

      <h1 className="page-title">{patient.full_name}</h1>
      <p className="patient-detail-email">{patient.email}</p>

      {plan && (
        <div className="current-plan-card">
          <h3>Plan actual</h3>
          <div className="macros-grid">
            <div className="macro-item">
              <span className="macro-value">{plan.calories}</span>
              <span className="macro-label">Kcal</span>
            </div>
            <div className="macro-item">
              <span className="macro-value">{plan.protein}g</span>
              <span className="macro-label">Proteína</span>
            </div>
            <div className="macro-item">
              <span className="macro-value">{plan.carbs}g</span>
              <span className="macro-label">Carbohidratos</span>
            </div>
            <div className="macro-item">
              <span className="macro-value">{plan.fats}g</span>
              <span className="macro-label">Grasas</span>
            </div>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: '28px', marginBottom: '14px' }}>
        {plan ? 'Actualizar plan' : 'Crear plan nutricional'}
      </h3>

      <form onSubmit={handleCreatePlan} className="plan-form">
        <div className="form-group">
          <label>Calorías (kcal)</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Proteína (g)</label>
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Carbohidratos (g)</label>
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Grasas (g)</label>
          <input
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            required
          />
        </div>

        {message && <p className="form-message">{message}</p>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Guardando...' : 'Guardar plan'}
        </button>
      </form>
    </div>
  )
}

export default PatientDetail