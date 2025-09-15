import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

export default function ModalNuevoPaciente({ datos, onChange, onClose, onSave }) {
  const [alergiasDisponibles, setAlergiasDisponibles] = useState([]);

  // 🔹 Cargar alergias desde el backend
  useEffect(() => {
    fetch("/api/alergias/") // ajusta la URL base si usas proxy o variable de entorno
      .then((res) => res.json())
      .then((data) => setAlergiasDisponibles(data))
      .catch((err) => console.error("Error cargando alergias:", err));
  }, []);

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
  const edadNum = parseInt(edadTexto);
  const esMenor = !isNaN(edadNum) && edadNum < 18;

  // 🔹 Manejo de selección múltiple de alergias
  const handleAlergiaChange = (id) => {
    const seleccionadas = datos.alergias_ids || [];
    if (seleccionadas.includes(id)) {
      onChange("alergias_ids", seleccionadas.filter((a) => a !== id));
    } else {
      onChange("alergias_ids", [...seleccionadas, id]);
    }
  };

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

          {datos.fecha_nacimiento && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              Edad: {edadTexto}
            </div>
          )}

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

          {/* 🔹 Nuevo campo: Selección de alergias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
            <div className="space-y-1 max-h-32 overflow-y-auto border rounded p-2">
              {alergiasDisponibles.map((alergia) => (
                <label key={alergia.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={datos.alergias_ids?.includes(alergia.id) || false}
                    onChange={() => handleAlergiaChange(alergia.id)}
                  />
                  {alergia.nombre}
                </label>
              ))}
            </div>
          </div>
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
