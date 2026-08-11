import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function MyPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      const { data } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('patient_id', user.id)
        .eq('status', 'active')
        .single()

      setPlan(data)
      setLoading(false)
    }
    loadPlan()
  }, [])

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1 className="page-title">Mi Plan Nutricional</h1>

      {!plan ? (
        <p>Tu nutriólogo aún no te ha asignado un plan.</p>
      ) : (
        <div className="current-plan-card">
          <h3>Objetivos diarios</h3>
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
    </div>
  )
}

export default MyPlan