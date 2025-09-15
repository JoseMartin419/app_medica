import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';

const PacientesHoy = () => {
  const [pacientesHoy, setPacientesHoy] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataConsultas = await fetch("http://localhost:8000/api/consultas/")
          .then(res => res.json());

        const hoy = new Date().toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' });

        const consultasDelDia = dataConsultas.filter(c => {
          const fechaConsulta = new Date(new Date(c.fecha).toLocaleString('en-US', {
            timeZone: 'America/Mexico_City'
          })).toLocaleDateString('es-MX');
          return fechaConsulta === hoy;
        });

        // 🔑 Contar pacientes únicos del día
        const pacientesUnicos = new Set(consultasDelDia.map(c => c.paciente)).size;

        setPacientesHoy(pacientesUnicos);
      } catch (error) {
        console.error("Error al cargar pacientes del día:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <div className="p-3 rounded-full bg-green-100 mb-4">
        <UserCheck className="text-green-500 text-3xl" />
      </div>
      <p className="text-gray-500 text-sm font-medium">Pacientes atendidos hoy</p>
      <p className="text-5xl font-bold text-gray-900 mt-2">{pacientesHoy}</p>
    </motion.div>
  );
};

export default PacientesHoy;
