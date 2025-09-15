import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EstadisticasConsultas = () => {
  const [data, setData] = useState([]);
  const [modo, setModo] = useState("por_dia"); // opciones: por_dia, por_semana, por_mes, por_anio
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/consultas/estadisticas/");
        const json = await res.json();
        setData(json[modo] || []);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [modo]);

  const getLabel = () => {
    switch (modo) {
      case "por_dia":
        return "fecha";
      case "por_semana":
        return "semana";
      case "por_mes":
        return "mes";
      case "por_anio":
        return "anio";
      default:
        return "fecha";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4">📊 Estadísticas de Consultas</h2>

      {/* Selector de vista */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "por_dia", label: "Día" },
          { key: "por_semana", label: "Semana" },
          { key: "por_mes", label: "Mes" },
          { key: "por_anio", label: "Año" },
        ].map((op) => (
          <button
            key={op.key}
            onClick={() => setModo(op.key)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              modo === op.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getLabel()} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="consultas" fill="#0077B6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EstadisticasConsultas;
