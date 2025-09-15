import React from 'react';
import { Calendar } from 'lucide-react';

export default function ModalNuevoPaciente({ datos, onChange, onClose, onSave }) {
  function calcularEdadDetallada(fechaNacimiento) {
    if (!fechaNacimiento) return 'Desconocida';
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

    if (años <= 0) {
      return `${meses} meses`;
    } else if (meses > 0) {
      return `${años} años y ${meses} meses`;
    } else {
      return `${años} años`;
    }
  }

  const edadTexto = calcularEdadDetallada(datos.fecha_nacimiento);
  const edadNum = parseInt(edadTexto); // extraemos el número para validaciónn
  const esMenor = !isNaN(edadNum) && edadNum < 18;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar nuevo paciente</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={datos.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={datos.fecha_nacimiento}
            onChange={(e) => onChange('fecha_nacimiento', e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* Mostrar edad en texto */}
          {datos.fecha_nacimiento && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              Edad: {edadTexto}
            </div>
          )}

          {/* Campo Tutor si es menor */}
          {esMenor && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre del Tutor</label>
              <input
                type="text"
                value={datos.tutor || ''}
                onChange={(e) => onChange("tutor", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )}

          <input
            type="tel"
            placeholder="Teléfono"
            value={datos.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={datos.correo}
            onChange={(e) => onChange('correo', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Guardar y continuar
          </button>
        </div>
      </div>
    </div>
  );
}
