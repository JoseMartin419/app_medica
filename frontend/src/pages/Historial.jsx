import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WidgetBienestar from '../components/WidgetBienestar';
import {
  User, Calendar, Search, ChevronDown, ClipboardList,
  AlertCircle, Plus, ArrowUp, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailSection = ({ title, content }) => (
  <div>
    <h4 className="text-sm font-medium text-slate-600 mb-1">{title}</h4>
    <p className="text-base text-slate-800 break-words">{content}</p>
  </div>
);

const PAGE_SIZE = 25;

export default function Historial() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [expandedConsulta, setExpandedConsulta] = useState(null);
  const navigate = useNavigate();

  const fetchConsultas = useCallback(async (pageNum, q, replace) => {
    try {
      const params = new URLSearchParams({ page: pageNum, page_size: PAGE_SIZE });
      if (q) params.set('q', q);
      const res = await fetch(`http://localhost:8000/api/consultas/?${params}`);
      const data = await res.json();
      const results = Array.isArray(data.results) ? data.results : [];
      setConsultas(prev => replace ? results : [...prev, ...results]);
      setHasMore(data.has_more ?? false);
    } catch (err) {
      console.error('Error al obtener consultas:', err);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    setLoading(true);
    fetchConsultas(1, '', true).finally(() => setLoading(false));
  }, [fetchConsultas]);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
      setLoading(true);
      fetchConsultas(1, searchInput, true).finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, fetchConsultas]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchConsultas(nextPage, searchTerm, false);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const formatDate = (fecha) => {
    try {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return 'Fecha inválida';
      return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <WidgetBienestar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Historial de Consultas</h1>
            <p className="mt-1 text-base text-slate-600">Busca, filtra y revisa todas las consultas registradas.</p>
          </div>
          <Link
            to="/consultas?nuevo=1"
            className="flex items-center justify-center bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-all"
          >
            <Plus size={16} className="mr-2" />
            Nueva Consulta
          </Link>
        </header>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-slate-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm"
              placeholder="Buscar por motivo, diagnóstico o paciente..."
            />
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 animate-pulse">
                <div className="h-5 w-48 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : consultas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">No se encontraron resultados</h3>
            <p className="mt-1 text-sm text-slate-500">Prueba con otro término de búsqueda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultas.map((consulta) => (
              <div
                key={consulta.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => setExpandedConsulta(prev => prev === consulta.id ? null : consulta.id)}
                  className="w-full text-left p-5 focus:outline-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center justify-center bg-indigo-100 p-3 rounded-full">
                        <ClipboardList className="text-indigo-600" size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-indigo-600">Consulta #{consulta.id}</p>
                        <h3 className="text-lg font-semibold text-slate-800">
                          {consulta.paciente_nombre || 'Paciente Desconocido'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                          <Calendar size={14} /> {formatDate(consulta.fecha)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                      {consulta.url_receta && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Con Receta
                        </span>
                      )}
                      <motion.div animate={{ rotate: expandedConsulta === consulta.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      </motion.div>
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expandedConsulta === consulta.id && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-200 p-6 bg-slate-50/70">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <DetailSection title="Motivo de Consulta" content={consulta.motivo} />
                          <DetailSection title="Diagnóstico" content={consulta.diagnostico} />
                          <DetailSection title="Antecedentes" content={consulta.antecedentes || 'No registrado'} />
                          <div>
                            <h4 className="text-sm font-medium text-slate-600 mb-1">Tratamiento</h4>
                            {consulta.tratamiento && consulta.tratamiento.length > 0 ? (
                              <ul className="list-disc list-inside text-base text-slate-800 space-y-1">
                                {consulta.tratamiento.map((med, i) => (
                                  <li key={i}><strong>{med.nombre}</strong>: {med.posologia}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-base text-slate-600 italic">No se registró tratamiento</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-3">
                          <button
                            onClick={() => navigate(`/pacientes/${consulta.paciente}`)}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                          >
                            <User size={16} className="mr-2" />
                            Ver Perfil del Paciente
                          </button>
                          {consulta.url_receta && (
                            <button
                              onClick={() => window.open(`http://localhost:8000${consulta.url_receta}`, '_blank', 'noopener,noreferrer')}
                              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Descargar Receta
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
                >
                  {loadingMore ? 'Cargando...' : 'Cargar más consultas'}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <ArrowUp size={16} className="mr-1 transition-transform group-hover:-translate-y-0.5" />
            Volver arriba
          </button>
        </div>
      </main>
    </div>
  );
}
