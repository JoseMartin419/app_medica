// frontend/src/components/Consultas/SuccessNotification.jsx
import React from "react";
import { motion } from "framer-motion";
import { Clipboard } from "lucide-react";

export default function SuccessNotification({ show, setShow }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="bg-green-100 p-2 rounded-full">
            <Clipboard className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Consulta registrada con éxito
          </h3>
          <p className="mt-1 text-sm text-green-700">
            La información de la consulta ha sido guardada correctamente.
          </p>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShow(false)}
              className="text-sm font-medium text-green-700 hover:text-green-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
