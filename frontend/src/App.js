import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Medicamentos from './pages/Medicamentos';
import ExpedientePaciente from './pages/ExpedientePacientes'; // Ajusta la ruta si es diferente
import ProcedimientosDashboard from './pages/ProcedimientosDashboard';

import Consultas from './pages/Consultas';

//import HistorialTodos from './pages/HistorialTodos';
import HistorialPaciente from './pages/Historial';
import Historial from './pages/Historial';
import Dashboard from './pages/Dashboard';
import CertificadoMedico from './pages/CertificadoMedico';






export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
      
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/historial/:pacienteId" element={<HistorialPaciente />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/pacientes/:id" element={<ExpedientePaciente />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/procedimientos" element={<ProcedimientosDashboard />} />
        <Route path="/certificado-medico" element={<CertificadoMedico />} />

      </Routes>
    </BrowserRouter>
  );
}
