// frontend/src/components/Consultas/ConsultaInfoForm.jsx
import React from "react";
import { Clipboard } from "lucide-react";
import DiagnosticoSelect from "../DiagnosticoSelect";

export default function ConsultaInfoForm({ consulta, handleChange, setConsulta }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Clipboard className="text-blue-500" size={20} />
        Información de la Consulta
      </h3>

      <div className="grid grid-cols-1 gap-6">
        <textarea
          name="motivo"
          value={consulta.motivo}
          onChange={handleChange}
          rows="2"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Motivo principal..."
        />

        <textarea
          name="antecedentes"
          value={consulta.antecedentes}
          onChange={handleChange}
          rows="2"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Antecedentes, alergias, etc."
        />

        <DiagnosticoSelect
          value={consulta.diagnostico}
          onChange={(val) => setConsulta((prev) => ({ ...prev, diagnostico: val }))}
        />

        <textarea
          name="notas"
          value={consulta.notas}
          onChange={handleChange}
          rows="2"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Notas adicionales..."
        />

        <input
          name="medico"
          value={consulta.medico}
          onChange={handleChange}
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Nombre del médico"
        />
      </div>
    </div>
  );
}
