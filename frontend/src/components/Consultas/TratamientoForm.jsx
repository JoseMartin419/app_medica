// src/components/consultas/TratamientoForm.jsx
import React, { useState } from "react";
import { Pill, Plus, Clock, AlertCircle } from "lucide-react";
import PanelMedicamentos from "../medicamentos/PanelMedicamentos";
import medicamentos from "../../data/medicamentos"; // respaldo local

// 🔹 Importar las reglas de posología del archivo adjunto
import  reglasPosologia  from "../../data/posologias"; // Ajusta la ruta si es necesario

export default function TratamientoForm({
  consulta,
  setConsulta,
  medicamentoActual,
  setMedicamentoActual,
  sugerencias,
  setSugerencias,
  agregarMedicamento,
  removerMedicamento,
  pacienteActual, // 🔹 Ya no es la fuente primaria del peso, pero se mantiene por si acaso
  // 💡 Nota: reglasPosologia se pasa como prop, pero la importación directa es más limpia
  // Si la posología viniera de una API o contexto, usarías el prop. Por ahora, importamos.
}) {
  const [mostrarPanel, setMostrarPanel] = useState(false);

  // 🔹 Estados para edición
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [medEditado, setMedEditado] = useState({
    nombre: "",
    posologia: "",
    duracion: "",
  });

  const guardarEdicion = () => {
    if (editandoIndex === null) return;
    setConsulta((prev) => {
      const nuevoTratamiento = [...prev.tratamiento];
      nuevoTratamiento[editandoIndex] = medEditado;
      return { ...prev, tratamiento: nuevoTratamiento };
    });
    setEditandoIndex(null);
  };

  /**
   * 🔹 Función para buscar y calcular la posología automáticamente
   * @param {string} nombre Nombre completo del medicamento (ej: 'Paracetamol 3.2g/100ml Suspensión 120ml')
   * @returns {{ posologia: string, duracion: string | undefined }} La posología calculada
   */
  const obtenerPosologiaAutomatica = (nombre) => {
    const regla = reglasPosologia[nombre];
    let posologiaCalculada = "";
    let duracionSugerida = ""; // La duración ya está incluida en la cadena de posología de tu archivo

    // OBTENER Y VALIDAR EL PESO desde el objeto 'consulta'
    const pesoNumerico = parseFloat(consulta.peso); // <-- Fuente de peso actualizada
    
    // 2. Ejecuta la función de la regla si existe y el peso es un número válido
    if (
      regla && 
      typeof regla.texto === 'function' && 
      !isNaN(pesoNumerico) && // Asegura que no es NaN
      pesoNumerico > 0 // Asegura que el peso es positivo
    ) {
      // 💡 Invocamos la función con el peso del paciente ya validado como número
      posologiaCalculada = regla.texto(pesoNumerico);
      // Extraer una duración simple si es necesaria por separado,
      // pero por ahora la dejamos dentro de 'posologia' para evitar complejidades.
    } else if (regla && typeof regla.texto === 'function') {
      // Para medicamentos que no dependen del peso (Ambroxol combinados)
      posologiaCalculada = regla.texto();
    }
    
    // Si la regla existe pero no es una función (ej. si tuvieras una regla estática)
    // Se podría añadir lógica aquí.
    
    return { posologia: posologiaCalculada, duracion: duracionSugerida };
  };

  return (
    <div className="space-y-6 relative">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Pill className="text-blue-500" size={20} />
        Tratamiento Médico
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Nombre medicamento con autocompletado */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicamento
          </label>
          <input
            type="text"
            value={medicamentoActual.nombre}
            onChange={(e) => {
              const nuevoNombre = e.target.value;

              // 🔹 Filtrar medicamentos (local)
              const resultados = medicamentos.filter(
                (med) =>
                  (med.label &&
                    med.label.toLowerCase().includes(nuevoNombre.toLowerCase())) ||
                  (med.nombre &&
                    med.nombre.toLowerCase().includes(nuevoNombre.toLowerCase()))
              );
              setSugerencias(resultados);

              // 🔹 Búsqueda y aplicación automática al escribir
              const { posologia, duracion } = obtenerPosologiaAutomatica(nuevoNombre);

              setMedicamentoActual((prev) => ({
                ...prev,
                nombre: nuevoNombre,
                // Aplicar posología/duración solo si se encontró una regla
                posologia: posologia || prev.posologia,
                duracion: duracion || prev.duracion,
              }));
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Nombre del medicamento"
            autoComplete="off"
          />

          {/* 🔹 Lista de sugerencias */}
          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto w-full shadow-md">
              {sugerencias.map((med, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    const nombreSeleccionado = med?.nombre || med?.label || "";
                    // 🔹 Aplicar dosificación automática al seleccionar de la lista
                    const { posologia, duracion } = obtenerPosologiaAutomatica(
                      nombreSeleccionado
                    );

                    setMedicamentoActual({
                      nombre: nombreSeleccionado,
                      posologia: posologia, // se usa la calculada, o ""
                      duracion: duracion, // se usa la calculada, o ""
                    });
                    setSugerencias([]);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                >
                  <span className="font-medium">
                    {med?.nombre || med?.label || "Sin nombre"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Posología */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posología
          </label>
          <input
            type="text"
            value={medicamentoActual.posologia}
            onChange={(e) =>
              setMedicamentoActual((prev) => ({
                ...prev,
                posologia: e.target.value,
              }))
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Dosis y frecuencia"
          />
        </div>
      </div>

      {/* Botón abrir panel */}
      <button
        type="button"
        onClick={() => setMostrarPanel(true)}
        className="inline-flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 border"
      >
        <Pill size={16} className="mr-2 text-blue-500" />
        Elegir de Panel
      </button>

      {/* Botón agregar manual */}
      <button
        type="button"
        onClick={agregarMedicamento}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="-ml-1 mr-2 h-5 w-5" />
        Agregar Medicamento
      </button>

      {/* Lista de medicamentos prescritos */}
      {consulta.tratamiento?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Medicamentos prescritos
          </h4>
          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
            {consulta.tratamiento.map((med, index) => (
              <li
                key={index}
                className="pl-3 pr-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2"
              >
                {editandoIndex === index ? (
                  <div className="w-full flex flex-col gap-2">
                    <input
                      type="text"
                      value={medEditado.nombre}
                      onChange={(e) =>
                        setMedEditado((prev) => ({
                          ...prev,
                          nombre: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Nombre del medicamento"
                    />
                    <input
                      type="text"
                      value={medEditado.posologia}
                      onChange={(e) =>
                        setMedEditado((prev) => ({
                          ...prev,
                          posologia: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Posología"
                    />
                    <input
                      type="text"
                      value={medEditado.duracion || ""}
                      onChange={(e) =>
                        setMedEditado((prev) => ({
                          ...prev,
                          duracion: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Duración"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={guardarEdicion}
                        className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditandoIndex(null)}
                        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex items-center">
                      <Pill className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 truncate">
                        <span className="font-medium">
                          {med.nombre || med.label || "-"}
                        </span>
                        {med.posologia && ` - ${med.posologia}`}
                        {med.duracion && ` (${med.duracion})`}
                      </span>
                    </div>
                    <div className="ml-4 flex gap-3">
                      <button
                        type="button"
                        className="text-indigo-500 hover:text-indigo-700"
                        onClick={() => {
                          setEditandoIndex(index);
                          setMedEditado(med);
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removerMedicamento(index)}
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-6">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-400" />
              Última edición: ahora
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle size={14} className="text-yellow-500" />
              Asegúrate que las dosis estén completas
            </div>
          </div>
        </div>
      )}

      {/* Modal con PanelMedicamentos */}
      {mostrarPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
            <button
              onClick={() => setMostrarPanel(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <PanelMedicamentos
              onSeleccionar={(med) => {
                const nombreSeleccionado = med.nombre || med.label || "Sin nombre";
                // 🔹 Aplicar dosificación automática al seleccionar del Panel
                const { posologia, duracion } = obtenerPosologiaAutomatica(
                  nombreSeleccionado
                );

                setConsulta((prev) => ({
                  ...prev,
                  tratamiento: [
                    ...prev.tratamiento,
                    {
                      nombre: nombreSeleccionado,
                      // Prioriza la posología automática si existe
                      posologia: posologia || med.posologia || med.descripcion || "",
                      duracion: duracion || med.duracion || "",
                    },
                  ],
                }));
              }}
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setMostrarPanel(false)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}