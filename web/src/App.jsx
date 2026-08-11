import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import MyPlan from './pages/MyPlan'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import DashboardLayout from './components/DashboardLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="patients"
            element={
              <RoleRoute allowedRole="nutritionist">
                <Patients />
              </RoleRoute>
            }
          />
          <Route
            path="patients/:id"
            element={
              <RoleRoute allowedRole="nutritionist">
                <PatientDetail />
              </RoleRoute>
            }
          />
          <Route
            path="my-plan"
            element={
              <RoleRoute allowedRole="patient">
                <MyPlan />
              </RoleRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App