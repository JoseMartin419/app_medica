// frontend/src/components/Consultas/SignosVitalesForm.jsx
import React from "react";
import { Activity, HeartPulse, Ruler, Weight, Thermometer, AlertTriangle } from "lucide-react";

export default function SignosVitalesForm({ consulta, handleChange, fueraDeRango, interpretarIMC }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Activity className="text-blue-500" size={20} />
        Registro de Signos Vitales
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Peso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Weight size={16} className="text-gray-500" /> Peso (kg)
          </label>
          <input
            name="peso"
            value={consulta.peso}
            onChange={handleChange}
            type="number"
            step="0.1"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="70.5"
          />
        </div>

        {/* Talla */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Ruler size={16} className="text-gray-500" /> Talla (cm)
          </label>
          <input
            name="talla"
            value={consulta.talla}
            onChange={handleChange}
            type="number"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="170"
          />
        </div>

        {/* IMC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Weight size={16} className="text-gray-500" /> IMC
          </label>
          <input
            name="imc"
            value={consulta.imc}
            readOnly
            className={`block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 ${
              consulta.imc && fueraDeRango("imc", consulta.imc) ? "border-red-300 text-red-600" : ""
            }`}
          />
          {consulta.imc && (
            <span className="text-xs">{interpretarIMC(consulta.imc)}</span>
          )}
        </div>

        {/* Frecuencia cardíaca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <HeartPulse size={16} className="text-gray-500" /> Frec. Cardíaca
          </label>
          <input
            name="frecuencia_cardiaca"
            value={consulta.frecuencia_cardiaca}
            onChange={handleChange}
            type="number"
            className={`block w-full rounded-md ${
              fueraDeRango("frecuencia_cardiaca", consulta.frecuencia_cardiaca)
                ? "border-red-300 text-red-600"
                : "border-gray-300"
            } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            placeholder="72"
          />
          {fueraDeRango("frecuencia_cardiaca", consulta.frecuencia_cardiaca) && (
            <AlertTriangle size={16} className="text-red-500 mt-1" />
          )}
        </div>

        {/* Presión arterial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Activity size={16} className="text-gray-500" /> Presión Arterial
          </label>
          <input
            name="presion_arterial"
            value={consulta.presion_arterial}
            onChange={handleChange}
            type="text"
            placeholder="120/80"
            className={`block w-full rounded-md ${
              fueraDeRango("presion_arterial", consulta.presion_arterial)
                ? "border-red-300 text-red-600"
                : "border-gray-300"
            } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
        </div>

        {/* Temperatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Thermometer size={16} className="text-gray-500" /> Temperatura
          </label>
          <input
            name="temperatura"
            value={consulta.temperatura}
            onChange={handleChange}
            type="number"
            step="0.1"
            placeholder="36.8"
            className={`block w-full rounded-md ${
              fueraDeRango("temperatura", consulta.temperatura)
                ? "border-red-300 text-red-600"
                : "border-gray-300"
            } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
        </div>
      </div>
    </div>
  );
}
