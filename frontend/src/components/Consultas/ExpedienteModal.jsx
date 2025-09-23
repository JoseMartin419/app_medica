// frontend/src/components/Consultas/ExpedienteModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function ExpedienteModal({ mostrar, setMostrar, pacienteActual, historial }) {
  if (!mostrar) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[80vh]">
        <button
          onClick={() => setMostrar(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Expediente de {pacienteActual.nombre}
        </h2>

        {historial.length === 0 ? (
          <p className="text-gray-500">
            No hay consultas registradas para este paciente.
          </p>
        ) : (
          <div className="space-y-4">
            {historial.map((h, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-800">
                  {new Date(h.fecha).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </h3>
                <p><strong>Motivo:</strong> {h.motivo}</p>
                <p><strong>Antecedentes:</strong> {h.antecedentes || "Sin antecedentes"}</p>
                <p><strong>Diagnóstico:</strong> {h.diagnostico}</p>
                <p><strong>Notas:</strong> {h.notas || "Sin notas"}</p>
                <div>
                  <p className="font-medium">Tratamiento:</p>
                  {h.tratamiento?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {h.tratamiento.map((med, i) => (
                        <li key={i}>
                          <strong>{med.nombre}</strong>: {med.posologia}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      No se registró tratamiento
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
