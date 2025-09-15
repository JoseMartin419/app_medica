import React from "react";

const PacientesTop = ({ pacientes }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Pacientes con más consultas</h2>
    {pacientes.length === 0 ? (
      <p className="text-gray-500">No hay datos disponibles</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {pacientes.map((p, index) => (
          <li key={p.id} className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-gray-900">
                {index + 1}. {p.nombre}
              </p>
              <p className="text-sm text-gray-500">
                {p.telefono || p.correo || "Sin contacto"}
              </p>
            </div>
            <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {p.num_consultas} consultas
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default PacientesTop;
