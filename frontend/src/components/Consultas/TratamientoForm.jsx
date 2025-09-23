import React, { useState } from "react";
import { Pill, Plus, Clock, AlertCircle } from "lucide-react";
import PanelMedicamentos from "../medicamentos/PanelMedicamentos";

export default function TratamientoForm({
  consulta,
  setConsulta,
  medicamentoActual,
  setMedicamentoActual,
  sugerencias,
  setSugerencias,
  agregarMedicamento,
  removerMedicamento,
  pacienteActual,
  reglasPosologia,
}) {
  const [mostrarPanel, setMostrarPanel] = useState(false);

  // 👇 Nuevo: estados globales para edición
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [medEditado, setMedEditado] = useState({ nombre: "", posologia: "", duracion: "" });

  const guardarEdicion = () => {
    if (editandoIndex === null) return;
    setConsulta((prev) => {
      const nuevoTratamiento = [...prev.tratamiento];
      nuevoTratamiento[editandoIndex] = medEditado;
      return { ...prev, tratamiento: nuevoTratamiento };
    });
    setEditandoIndex(null);
  };

  return (
    <div className="space-y-6 relative">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Pill className="text-blue-500" size={20} />
        Tratamiento Médico
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Nombre medicamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medicamento</label>
          <input
            type="text"
            value={medicamentoActual.nombre}
            onChange={(e) => {
              const nuevoNombre = e.target.value;
              setMedicamentoActual((prev) => {
                const peso = parseFloat(consulta.peso) || 0;
                const key = nuevoNombre.toLowerCase().trim();
                const regla = reglasPosologia[key];
                const posologiaCalculada =
                  regla && peso > 0 ? regla.texto(peso) : prev.posologia;

                return { ...prev, nombre: nuevoNombre, posologia: posologiaCalculada };
              });
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Nombre del medicamento"
            autoComplete="off"
          />
        </div>

        {/* Posología */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Posología</label>
          <input
            type="text"
            value={medicamentoActual.posologia}
            onChange={(e) =>
              setMedicamentoActual((prev) => ({ ...prev, posologia: e.target.value }))
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Dosis y frecuencia"
          />
        </div>
      </div>

      {/* Botón para abrir el panel flotante */}
      <button
        type="button"
        onClick={() => setMostrarPanel(true)}
        className="inline-flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 border"
      >
        <Pill size={16} className="mr-2 text-blue-500" />
        Elegir de Panel
      </button>

      {/* Botón agregar manualmente */}
      <button
        type="button"
        onClick={agregarMedicamento}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="-ml-1 mr-2 h-5 w-5" />
        Agregar Medicamento
      </button>

      {/* Lista prescritos */}
      {consulta.tratamiento?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Medicamentos prescritos</h4>
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
                        setMedEditado((prev) => ({ ...prev, nombre: e.target.value }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Nombre del medicamento"
                    />
                    <input
                      type="text"
                      value={medEditado.posologia}
                      onChange={(e) =>
                        setMedEditado((prev) => ({ ...prev, posologia: e.target.value }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Posología"
                    />
                    <input
                      type="text"
                      value={medEditado.duracion || ""}
                      onChange={(e) =>
                        setMedEditado((prev) => ({ ...prev, duracion: e.target.value }))
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
                        <span className="font-medium">{med.nombre}</span> - {med.posologia}{" "}
                        {med.duracion && `(${med.duracion})`}
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

      {/* Modal PanelMedicamentos */}
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
                setConsulta((prev) => ({
                  ...prev,
                  tratamiento: [
                    ...prev.tratamiento,
                    { nombre: med.nombre, posologia: med.posologia || "", duracion: "" },
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
