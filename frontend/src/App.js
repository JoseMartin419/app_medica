import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Medicamentos from './pages/Medicamentos';
import ExpedientePaciente from './pages/ExpedientePacientes';
import ProcedimientosDashboard from './pages/ProcedimientosDashboard';
import Consultas from './pages/Consultas';
import Historial from './pages/Historial';
import Dashboard from './pages/Dashboard';
import CertificadoMedico from './pages/CertificadoMedico';



export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/historial/:pacienteId" element={<Historial />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/pacientes/:id" element={<ExpedientePaciente />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/procedimientos" element={<ProcedimientosDashboard />} />
        <Route path="/certificado-medico" element={<CertificadoMedico />} />
      </Routes>
    </BrowserRouter>
  );
}
