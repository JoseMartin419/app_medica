import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { Calendar, Phone, Mail, User, ClipboardList, ChevronLeft } from 'lucide-react';

export default function ExpedientePaciente() {
  const { id } = useParams(); // ID del paciente desde la URL
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
 

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resPaciente = await fetch(`http://localhost:8000/api/pacientes/${id}/`);
        const dataPaciente = await resPaciente.json();
        setPaciente(dataPaciente);

        const resConsultas = await fetch(`http://localhost:8000/api/pacientes/historial/${id}/`);
        const dataConsultas = await resConsultas.json();
        if (Array.isArray(dataConsultas)) {
          setConsultas(dataConsultas);
        } else {
          console.warn("⚠️ La respuesta de consultas no es un arreglo:", dataConsultas);
          setConsultas([]);
        }

        setConsultas(dataConsultas);
      } catch (err) {
        console.error("Error al cargar expediente:", err);
      }
    };

    cargarDatos();
  }, [id]);

  const calcularEdadDetallada = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'Desconocida';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();
    if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
      años--;
      meses += 12;
    }
    if (hoy.getDate() < nacimiento.getDate()) meses--;
    if (años <= 0) return `${meses} meses`;
    if (meses > 0) return `${años} años y ${meses} meses`;
    return `${años} años`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:underline flex items-center gap-1">
        <ChevronLeft size={18} />
        Volver
      </button>

      {paciente && (
        <div className="bg-white shadow rounded-xl p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={24} className="text-blue-500" />
            {paciente.nombre}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span>Nacimiento: {paciente.fecha_nacimiento}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span>Edad: {calcularEdadDetallada(paciente.fecha_nacimiento)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              <span>{paciente.telefono || 'Sin teléfono'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              <span>{paciente.correo || 'Sin correo'}</span>
            </div>
            {paciente.tutor && (
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span>Tutor: {paciente.tutor}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de consultas */}
      <div className="space-y-6">
      {consultas.length === 0 ? (
          <p className="text-gray-600">Este paciente no tiene consultas registradas.</p>
        ) : (
          Array.isArray(consultas) && consultas.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow border p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardList size={18} className="text-indigo-500" />
                  Consulta #{c.id}
                </h3>
                <span className="text-sm text-gray-500">{new Date(c.fecha).toLocaleString('es-MX')}</span>
              </div>
              <p className="text-sm text-gray-700"><strong>Motivo:</strong> {c.motivo}</p>
              <p className="text-sm text-gray-700"><strong>Diagnóstico:</strong> {c.diagnostico}</p>
              {c.url_receta && (
                <a
                  href={`http://localhost:8000${c.url_receta}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 text-sm mt-2 inline-block hover:underline"
                >
                  Ver receta médica
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
