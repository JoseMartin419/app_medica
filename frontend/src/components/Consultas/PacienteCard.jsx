// frontend/src/components/Consultas/PacienteCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { User, Calendar, Phone, Mail, AlertCircle, FileText, Weight } from "lucide-react"; // <-- Agregado Weight

export default function PacienteCard({ pacienteActual, cargarHistorial, setMostrarExpediente }) {
  if (!pacienteActual) return null;

  const calcularEdadDetallada = (fechaNacimiento) => {
    if (!fechaNacimiento) return "Desconocida";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();

    if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
      años--;
      meses += 12;
    }

    if (hoy.getDate() < nacimiento.getDate()) {
      meses--;
    }

    if (años <= 0) return `${meses} meses`;
    if (meses > 0) return `${años} años y ${meses} meses`;
    return `${años} años`;
  };

  const edadTexto = calcularEdadDetallada(pacienteActual.fecha_nacimiento);
  const edadNum = parseInt(edadTexto);
  const mostrarTutor =
    !isNaN(edadNum) && edadNum < 18 && pacienteActual.tutor;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-500"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {pacienteActual.nombre}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span>Nac: {pacienteActual.fecha_nacimiento}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span>Edad: {edadTexto}</span>
            </div>
            
            {/* INICIO: Campo de Peso Añadido */}
            {pacienteActual.ultimo_peso_kg && (
              <div className="flex items-center gap-2">
                <Weight size={14} className="text-gray-400" />
                <span>Peso: {pacienteActual.ultimo_peso_kg} kg</span>
              </div>
            )}
            {/* FIN: Campo de Peso Añadido */}

            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <span>{pacienteActual.telefono || "Sin teléfono"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <span>{pacienteActual.correo || "Sin correo"}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-3">
              <AlertCircle size={14} className="text-red-500" />
              <span>
                Alergias:{" "}
                {pacienteActual.alergias?.length > 0
                  ? pacienteActual.alergias.map((a) => a.nombre).join(", ")
                  : "Ninguna"}
              </span>
            </div>
            {mostrarTutor && (
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                <span>Tutor: {pacienteActual.tutor}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              cargarHistorial(pacienteActual.id);
              setMostrarExpediente(true);
            }}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-2"
          >
            <FileText size={16} />
            Ver expediente
          </button>
        </div>
      </div>
    </motion.div>
  );
}