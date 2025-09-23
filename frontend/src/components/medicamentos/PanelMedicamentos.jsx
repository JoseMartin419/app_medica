import React, { useState, useEffect } from "react";
import recetasRapidas from "../../data/recetasRapidas";

export default function PanelMedicamentos({ onSeleccionar }) {
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [todos, setTodos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  // 🔎 Buscar
  const buscar = async (query) => {
    if (!query.trim()) {
      setSugerencias([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/medicamentos-frecuentes/?search=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const resultados = await response.json();
        setSugerencias(resultados);
      }
    } catch (err) {
      console.error("Error cargando medicamentos frecuentes:", err);
    }
  };

  // 📥 Cargar todos al inicio
  const cargarTodos = async () => {
    try {
      const response = await fetch("/api/medicamentos-frecuentes/");
      if (response.ok) {
        const resultados = await response.json();
        setTodos(resultados);
      }
    } catch (err) {
      console.error("Error cargando lista completa:", err);
    }
  };

  useEffect(() => {
    buscar(busqueda);
  }, [busqueda]);

  useEffect(() => {
    cargarTodos();
  }, []);

  // 📌 Paginación
  const totalPaginas = Math.ceil(todos.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  const listaPaginada = todos.slice(inicio, fin);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border w-full max-w-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        💊 Medicamentos Frecuentes
      </h3>

      {/* 🔹 Recetas rápidas */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          ⚡ Recetas rápidas
        </h4>
        <div className="flex flex-wrap gap-2">
          {recetasRapidas.map((receta, idx) => (
            <button
              key={idx}
              onClick={() =>
                receta.medicamentos.forEach((med) => onSeleccionar && onSeleccionar(med))
              }
              className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"
            >
              {receta.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* 🔍 Input de búsqueda */}
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar medicamento..."
        className="w-full mb-3 border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* 🔍 Resultados de búsqueda */}
      {busqueda && sugerencias.length > 0 ? (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {sugerencias.map((med) => (
            <li
              key={med.id}
              onClick={() => onSeleccionar && onSeleccionar(med)}
              className="p-3 border rounded-md bg-gray-50 hover:bg-blue-50 cursor-pointer"
            >
              <span className="font-medium">{med.nombre}</span>
              {med.posologia && (
                <span className="block text-xs text-gray-500">{med.posologia}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <>
          {/* 📋 Lista paginada */}
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {listaPaginada.map((med) => (
              <li
                key={med.id}
                onClick={() => onSeleccionar && onSeleccionar(med)}
                className="p-3 border rounded-md bg-gray-50 hover:bg-blue-50 cursor-pointer"
              >
                <span className="font-medium">{med.nombre}</span>
                {med.posologia && (
                  <span className="block text-xs text-gray-500">{med.posologia}</span>
                )}
              </li>
            ))}
          </ul>

          {/* 📌 Paginación */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina((p) => p - 1)}
              className={`px-3 py-1 rounded-md ${
                pagina === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Anterior
            </button>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <button
              disabled={pagina === totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
              className={`px-3 py-1 rounded-md ${
                pagina === totalPaginas
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
