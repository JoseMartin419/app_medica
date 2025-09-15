import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Calendar as CalendarIcon } from "lucide-react";

const PacientesPorDia = () => {
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0]); // hoy
  const [pacientesDia, setPacientesDia] = useState(0);
  const [loading, setLoading] = useState(false);
  const [year, month, day] = fecha.split("-");
  const fechaLocal = new Date(year, month - 1, day);


  const fetchPacientesPorDia = async (fechaSeleccionada) => {
    try {
      setLoading(true);
      const dataConsultas = await fetch("http://localhost:8000/api/consultas/")
        .then((res) => res.json());

      const consultasDelDia = dataConsultas.filter((c) => {
        const fechaConsulta = new Date(
          new Date(c.fecha).toLocaleString("en-US", {
            timeZone: "America/Mexico_City",
          })
        ).toLocaleDateString("es-MX");

        const fechaSeleccionadaFmt = new Date(
          fechaSeleccionada + "T00:00:00"
        ).toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" });

        return fechaConsulta === fechaSeleccionadaFmt;
      });

      // 🔑 Pacientes únicos en esa fecha
      const pacientesUnicos = new Set(consultasDelDia.map((c) => c.paciente)).size;
      setPacientesDia(pacientesUnicos);
    } catch (error) {
      console.error("Error al cargar pacientes por día:", error);
      setPacientesDia(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientesPorDia(fecha);
  }, [fecha]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-purple-100">
          <UserCheck className="text-purple-600 text-3xl" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Pacientes por día</h2>
      </div>

      {/* Selector de fecha */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="text-gray-500" size={18} />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm focus:ring focus:ring-purple-300"
        />
      </div>

      {loading ? (
        <p className="text-gray-400 mt-2">Cargando...</p>
      ) : (
        <p className="text-5xl font-bold text-gray-900 mt-2">{pacientesDia}</p>
      )}


      <p className="text-sm text-gray-500 mt-2">
        Pacientes atendidos el{" "}
        {fechaLocal.toLocaleDateString("es-MX", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

    </motion.div>
  );
};

export default PacientesPorDia;
