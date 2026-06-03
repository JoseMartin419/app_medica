// =====================================================
// 📁 src/pages/Dashboard.jsx — Panel Médico Completo
// =====================================================
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import PacientesTop from "../components/Dashboard/PacientesTop";
import PacientesHoy from "../components/Dashboard/PacientesHoy";
import PacientesPorDia from "../components/Dashboard/PacientesPorDia";
import EstadisticasConsultas from "../components/Dashboard/EstadisticasConsultas";
import TiemposConsultasHoy from "../components/Dashboard/TiemposConsultasHoy"; // ✅ Nuevo componente

// -----------------------------------------------------
// Tarjeta: Consultas de hoy
// -----------------------------------------------------
const MetricCardToday = ({ count }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
    <div className="p-3 rounded-full bg-blue-100 mb-4">
      <FiCalendar className="text-blue-500 text-3xl" />
    </div>
    <p className="text-gray-500 text-sm font-medium">Consultas de hoy</p>
    <p className="text-5xl font-bold text-gray-900 mt-2">{count}</p>
  </div>
);

// -----------------------------------------------------
// Componente Principal: Dashboard
// -----------------------------------------------------
const Dashboard = () => {
  const [consultasHoy, setConsultasHoy] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pacientesTop, setPacientesTop] = useState([]);

  // =====================================================
  // 🔹 1. Cargar número de consultas de hoy
  // =====================================================
  useEffect(() => {
    const fetchTodayConsults = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/pacientes/estadisticas/diarias/?days=7"
        );
        const data = await response.json();

        const today = new Date().toISOString().split("T")[0];
        const todayData = data.find((item) => item.fecha === today);

        setConsultasHoy(todayData ? todayData.count : 0);
      } catch (error) {
        console.error("Error al obtener las consultas de hoy:", error);
        setConsultasHoy(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayConsults();
  }, []);

  // =====================================================
  // 🔹 2. Cargar pacientes con más consultas
  // =====================================================
  useEffect(() => {
    const fetchPacientesTop = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/pacientes/top-consultas/"
        );
        const data = await response.json();
        setPacientesTop(data);
      } catch (error) {
        console.error("Error al obtener pacientes top:", error);
      }
    };

    fetchPacientesTop();
  }, []);

  // =====================================================
  // 🔹 3. Renderizado principal
  // =====================================================
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Panel de control
          </h1>
          <p className="text-gray-500">
            Bienvenido, revisa tu rendimiento y tus pacientes del día.
          </p>
        </motion.div>

        {/* Indicador de carga */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Sección de tarjetas principales */}
            <motion.section
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MetricCardToday count={consultasHoy} />
              <PacientesHoy />
              <PacientesTop pacientes={pacientesTop} />
              <PacientesPorDia />
              <TiemposConsultasHoy /> {/* ✅ Nuevo componente agregado */}
            </motion.section>

            {/* Sección de estadísticas (gráficas) */}
            <motion.section
              className="mt-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EstadisticasConsultas />
            </motion.section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
