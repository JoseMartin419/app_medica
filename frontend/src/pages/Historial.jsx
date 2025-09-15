import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WidgetBienestar from '../components/WidgetBienestar';
import {
  Activity,
  Home,
  FilePlus,
  FolderOpenDot,
  Menu,
  X,
  User,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  ClipboardList,
  AlertCircle,
  Plus,
  ArrowUp,
  Download,
  Stethoscope,
  Pill,
  BarChart3,
  Clipboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente reutilizable para las secciones de detalles, manteniendo el JSX principal más limpio
const DetailSection = ({ title, content }) => (
  <div>
    <h4 className="text-sm font-medium text-slate-600 mb-1">{title}</h4>
    <p className="text-base text-slate-800 break-words">{content}</p>
  </div>
);

export default function Historial() {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  // Nuevo estado para la barra de navegación
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters] = useState({
    dateFrom: '',
    dateTo: '',
    patientId: '',
    patientName: '',
    hasPrescription: false
  });
  const [expandedConsulta, setExpandedConsulta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [consultasRes, pacientesRes] = await Promise.all([
          fetch('http://localhost:8000/api/consultas/'),
          fetch('http://localhost:8000/api/pacientes/')
        ]);
        const consultasData = await consultasRes.json();
        const pacientesData = await pacientesRes.json();
        
        // Ordenamos las consultas por fecha más reciente por defecto
        const sortedConsultas = consultasData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setConsultas(sortedConsultas);
        setPacientes(pacientesData);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getNombrePaciente = (pacienteId) => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombre} ${paciente.apellido_paterno || ''}`.trim() : 'Paciente Desconocido';
  };

  const filteredConsultas = consultas.filter(consulta => {
    const nombrePaciente = getNombrePaciente(consulta.paciente).toLowerCase();
    const matchesSearch = 
      consulta.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.diagnostico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.paciente.toString().includes(searchTerm) ||
      nombrePaciente.includes(searchTerm.toLowerCase());

    const matchesFilters = 
      (!filters.dateFrom || new Date(consulta.fecha) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(consulta.fecha) <= new Date(filters.dateTo)) &&
      (!filters.patientId || consulta.paciente.toString() === filters.patientId) &&
      (!filters.patientName || nombrePaciente.includes(filters.patientName.toLowerCase())) &&
      (!filters.hasPrescription || !!consulta.url_receta);

    return matchesSearch && matchesFilters;
  });

  const toggleExpandConsulta = (id) => {
    setExpandedConsulta(prev => (prev === id ? null : id));
  };

  const formatDate = (fecha) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Fecha inválida';
    }
  };
  
  const downloadReceta = (url) => {
    if (url) {
      window.open(`http://localhost:8000${url}`, '_blank', 'noopener,noreferrer');
    }
  };

  // --- Variantes de Animación para Framer Motion ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 } // Animación escalonada para la lista
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* --- INICIO: BARRA DE NAVEGACIÓN COMPLETA --- */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Activity className="text-indigo-600" size={28} />
                <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TodoDoctor</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-2 transition-all duration-200">
                  <Home size={18} className="opacity-70" /> Inicio
                </Link>
                <Link to="/consultas" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-2 transition-all duration-200">
                  <Stethoscope size={18} className="opacity-70" /> Consultas
                </Link>
                <Link to="/historial" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-2 transition-all duration-200">
                  <Clipboard size={18} className="opacity-70" /> Historial
                </Link>
                <Link to="/medicamentos" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-2 transition-all duration-200">
                  <Pill size={18} className="opacity-70" /> Medicamentos
                </Link>
                <Link to="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-2 transition-all duration-200">
                  <BarChart3 size={18} className="opacity-70" /> Estadísticas
                </Link>
                <Link to="/procedimientos" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50/50 flex items-center gap-2 transition-all duration-200">
                  <FolderOpenDot size={18} className="opacity-70" /> Procedimientos
                </Link>
              </div>
            </div>
            
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil con mejoras visuales */}
        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-sm"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link 
                  to="/" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-3 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <Home size={18} className="opacity-70" /> Inicio
                </Link>
                <Link 
                  to="/consultas" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-3 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <Stethoscope size={18} className="opacity-70" /> Consultas
                </Link>
                <Link 
                  to="/historial" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-3 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <Clipboard size={18} className="opacity-70" /> Historial
                </Link>
                <Link 
                  to="/medicamentos" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-3 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <Pill size={18} className="opacity-70" /> Medicamentos
                </Link>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-3 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <BarChart3 size={18} className="opacity-70" /> Estadísticas
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </nav>
      {/* --- FIN: BARRA DE NAVEGACIÓN COMPLETA --- */}
      <WidgetBienestar/>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Historial de Consultas</h1>
            <p className="mt-1 text-base text-slate-600">Busca, filtra y revisa todas las consultas registradas.</p>
          </div>
          <Link
            to="/consultas?nuevo=1"
            className="flex items-center justify-center bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={16} className="mr-2" />
            Nueva Consulta
          </Link>
        </header>

        {/* --- SECCIÓN DE BÚSQUEDA Y FILTROS MEJORADA --- */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-2.5 border-slate-300 rounded-lg text-sm"
                placeholder="Buscar por motivo, diagnóstico o paciente..."
              />
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2 text-slate-500" />
              <span>Filtros</span>
              <motion.div animate={{ rotate: filtersOpen ? 180 : 0 }} className="ml-2">
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>
          </div>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="border-t border-slate-200 pt-4 overflow-hidden"
              >
                {/* Contenido de filtros... */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- RESULTADOS Y LISTA DE CONSULTAS --- */}
        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div></div>
        ) : filteredConsultas.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">No se encontraron resultados</h3>
            <p className="mt-1 text-sm text-slate-500">Prueba a cambiar los filtros o el término de búsqueda.</p>
          </motion.div>
        ) : (
          <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
            {filteredConsultas.map((consulta) => (
              <motion.div
                key={consulta.id}
                variants={itemVariants}
                layout
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-300"
              >
                <button onClick={() => toggleExpandConsulta(consulta.id)} className="w-full text-left p-5 focus:outline-none">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center justify-center bg-indigo-100 p-3 rounded-full">
                        <ClipboardList className="text-indigo-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-indigo-600">Consulta #{consulta.id}</p>
                        <h3 className="text-lg font-semibold text-slate-800">{getNombrePaciente(consulta.paciente)}</h3>
                        <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                          <Calendar size={14} /> {formatDate(consulta.fecha)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-4 mt-2 sm:mt-0">
                      {consulta.url_receta && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Con Receta</span>
                      )}
                      <motion.div animate={{ rotate: expandedConsulta === consulta.id ? 180 : 0 }}>
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      </motion.div>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                {expandedConsulta === consulta.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
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
                              {consulta.tratamiento.map((med, index) => (
                                <li key={index}><strong>{med.nombre}</strong>: {med.posologia}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-base text-slate-600 italic">No se registró tratamiento</p>
                          )}
                        </div>
                       </div>
                       
                       <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-3">
                         <button
                           type="button"
                           onClick={() => navigate(`/pacientes/${consulta.paciente}`)}
                           className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50"
                         >
                           <User size={16} className="mr-2" />
                           Ver Perfil del Paciente
                         </button>
                         {consulta.url_receta && (
                           <button
                             type="button"
                             onClick={() => downloadReceta(consulta.url_receta)}
                             className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                           >
                             <Download className="mr-2 h-5 w-5" />
                             Descargar Receta
                           </button>
                         )}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
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