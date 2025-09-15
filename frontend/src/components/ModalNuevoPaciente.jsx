// frontend/src/components/ModalNuevoPaciente.jsx
import React, { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';

export default function ModalNuevoPaciente({ datos, onChange, onClose, onSave }) {
  const [alergiasDisponibles, setAlergiasDisponibles] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // 🔹 Cargar alergias desde el backend
  useEffect(() => {
    fetch("/api/alergias/")
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

  // 🔹 Crear nueva alergia en el backend
  const crearNuevaAlergia = async () => {
    if (!busqueda.trim()) return;
    try {
      setCargando(true);
      const res = await fetch("/api/alergias/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: busqueda.trim() }),
      });

      if (res.ok) {
        const nueva = await res.json();
        setAlergiasDisponibles((prev) => [...prev, nueva]);
        onChange("alergias_ids", [...(datos.alergias_ids || []), nueva.id]);
        setBusqueda('');
      } else {
        console.error("Error al crear alergia");
      }
    } catch (error) {
      console.error("Error de red al crear alergia:", error);
    } finally {
      setCargando(false);
    }
  };

  // 🔹 Filtrar alergias según la búsqueda
  const alergiasFiltradas = alergiasDisponibles.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar nuevo paciente</h2>

        <div className="space-y-4">
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre completo"
            value={datos.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* Fecha de nacimiento */}
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

          {/* Tutor si es menor */}
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

          {/* Teléfono */}
          <input
            type="tel"
            placeholder="Teléfono"
            value={datos.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* Correo */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={datos.correo}
            onChange={(e) => onChange('correo', e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* 🔹 Campo de búsqueda y selección de alergias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>

            {/* Barra de búsqueda + botón */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar o agregar alergia..."
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={crearNuevaAlergia}
                disabled={cargando}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-1 disabled:opacity-50"
              >
                <Plus size={16} />
                {cargando ? "..." : "Agregar"}
              </button>
            </div>

            {/* Lista filtrada */}
            <div className="space-y-1 max-h-32 overflow-y-auto border rounded p-2">
              {alergiasFiltradas.map((alergia) => (
                <label key={alergia.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={datos.alergias_ids?.includes(alergia.id) || false}
                    onChange={() => handleAlergiaChange(alergia.id)}
                  />
                  {alergia.nombre}
                </label>
              ))}

              {alergiasFiltradas.length === 0 && (
                <p className="text-sm text-gray-500">No se encontraron alergias</p>
              )}
            </div>
          </div>
        </div>

        {/* Botones */}
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
