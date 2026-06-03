import React, { useEffect, useState } from "react";

const TiemposConsultasHoy = () => {
  const [consultas, setConsultas] = useState([]);
  const [promedio, setPromedio] = useState(0);

  useEffect(() => {
    const fetchConsultasHoy = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/consultas-hoy/");
        const data = await res.json();

        // Ordenar por hora
        const ordenadas = data.sort(
          (a, b) => new Date(a.hora) - new Date(b.hora)
        );

        // Calcular diferencias
        const diferencias = [];
        for (let i = 1; i < ordenadas.length; i++) {
          const diffMs =
            new Date(ordenadas[i].hora) - new Date(ordenadas[i - 1].hora);
          const diffMin = Math.round(diffMs / 60000);
          diferencias.push(diffMin);
        }

        const promedioMin =
          diferencias.length > 0
            ? Math.round(
                diferencias.reduce((acc, val) => acc + val, 0) /
                  diferencias.length
              )
            : 0;

        setConsultas(
          ordenadas.map((c, i) => ({
            ...c,
            diff: i === 0 ? null : diferencias[i - 1],
          }))
        );
        setPromedio(promedioMin);
      } catch (err) {
        console.error("Error al obtener las consultas:", err);
      }
    };

    fetchConsultasHoy();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        ⏱️ Tiempos entre consultas (hoy)
      </h2>
      <p className="text-gray-600 mb-4">
        Promedio: <strong>{promedio} min</strong> por paciente
      </p>
      <table className="w-full text-sm text-left border-t border-gray-100">
        <thead>
          <tr className="text-gray-500">
            <th className="py-2">Hora</th>
            <th className="py-2">Paciente</th>
            <th className="py-2 text-right">Minutos desde anterior</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="py-2">{new Date(c.hora).toLocaleTimeString("es-MX", {hour: "2-digit", minute: "2-digit"})}</td>
              <td className="py-2">{c.paciente}</td>
              <td className="py-2 text-right">
                {c.diff !== null ? `${c.diff} min` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TiemposConsultasHoy;
