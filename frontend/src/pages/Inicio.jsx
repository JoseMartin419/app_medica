import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerPacientes, obtenerHistorialPorPaciente, crearPaciente } from '../api/pacientes';
import ModalNuevoPaciente from '../components/ModalNuevoPaciente';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, FolderOpenDot, ClipboardCheck, Home, User, Calendar, UserCheck, Phone,  Mail, Plus, AlertTriangle, Stethoscope, Clipboard, Pill, BarChart3 } from 'lucide-react';
import DashboardMetrics from '../components/DashboardMetrics';
import WidgetBienestar from '../components/WidgetBienestar';



export default function Inicio() {
  const [open, setOpen] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoPaciente, setNuevoPaciente] = useState({ nombre: '', fecha_nacimiento: '', telefono: '', correo: '', tutor: '' });
  const [busqueda, setBusqueda] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [consultasHoy, setConsultasHoy] = useState(0);
  const [recetasGeneradas, setRecetasGeneradas] = useState(0);
  const [alertasActivas] = useState(3);
  const [, setConsultasDelDia] = useState([]);  
  const [consultasPorFranja, setConsultasPorFranja] = useState({
    mañana: 0,
    tarde: 0,
    noche: 0
  });

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const [dataPacientes, dataConsultas] = await Promise.all([
          obtenerPacientes(),
          fetch("http://localhost:8000/api/consultas/").then(res => res.json())
        ]);
        
        setPacientes(dataPacientes);
        setTotalPacientes(dataPacientes.length);
        
        const hoy = new Date().toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' });

        const consultasDelDia = dataConsultas.filter(c => {
          const fechaConsulta = new Date(new Date(c.fecha).toLocaleString('en-US', {
            timeZone: 'America/Mexico_City'
          })).toLocaleDateString('es-MX');
        
          return fechaConsulta === hoy;
        });
        
        const consultasPorFranja = {
          mañana: consultasDelDia.filter(c => {
            const hora = new Date(c.fecha).getHours();
            return hora >= 8 && hora < 12;
          }).length,
          tarde: consultasDelDia.filter(c => {
            const hora = new Date(c.fecha).getHours();
            return hora >= 12 && hora < 18;
          }).length,
          noche: consultasDelDia.filter(c => {
            const hora = new Date(c.fecha).getHours();
            return hora >= 18 || hora < 8;
          }).length
        };
        
        setConsultasDelDia(consultasDelDia);
        setConsultasPorFranja(consultasPorFranja);
        
        setConsultasHoy(consultasDelDia.length);
        setRecetasGeneradas(dataConsultas.length);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, []);

  const handleBusqueda = () => {
    const pacienteEncontrado = pacientes.find(p => 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    
    if (pacienteEncontrado) {
      navigate(`/consultas?nuevo=1&paciente=${pacienteEncontrado.id}`);
    } else {
      setNuevoPaciente({ 
        nombre: busqueda, 
        fecha_nacimiento: '', 
        telefono: '', 
        correo: '' ,
        alergias_ids: []  

      });
      setMostrarModal(true);
    }
  };

  const cargarHistorial = async (id) => {
    try {
      const data = await obtenerHistorialPorPaciente(id);
      setHistorial(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setHistorial([]);
    }
  };

  const resultados = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 font-sans">
      {/* Barra de navegación mejorada */}
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
          
      {/* Contenido principal mejorado */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Alerta mejorada */}
        {alertasActivas >= 5 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-100/80 border-l-4 border-amber-500 text-amber-800 px-4 py-3 rounded-lg mb-6 shadow-sm flex items-center gap-3"
          >
            <AlertTriangle className="text-amber-600" size={20} />
            <span>Hay <strong>{alertasActivas} alertas médicas</strong> activas que requieren atención.</span>
          </motion.div>
        )}

        {/* Hero section mejorada */}
        <section className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
          >
            Gestión Médica <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Inteligente</span>
          </motion.h1>
          
          {cargando && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-10"
            >
              <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </motion.div>
            
          )}
          
     

          {/* Buscador mejorado visualmente */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="max-w-2xl mx-auto relative"
          >
            <div className="relative shadow-lg rounded-xl overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 p-1">
              <div className="flex bg-white rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar paciente por nombre..."
                  autoComplete="off"
                  className="w-full py-4 px-6 text-gray-700 focus:outline-none focus:ring-0 border-0"
                />
                <button
                  onClick={handleBusqueda}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  <span className="hidden sm:inline">Buscar</span>
                  <Plus className="ml-2" size={18} />
                </button>
              </div>
            </div>
            
            {busqueda && resultados.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {resultados.map(p => (
                  <motion.div
                    key={p.id}
                    whileHover={{ backgroundColor: "#f5f3ff" }}
                    onClick={() => {
                      setSeleccionado(p);
                      cargarHistorial(p.id);
                      setBusqueda('');
                    }}
                    className="px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <User className="text-indigo-600" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{p.nombre}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Calendar size={12} /> {p.fecha_nacimiento}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
          
        </section>
        
        {/* Detalles del paciente seleccionado - Mejorado visualmente */}
        {seleccionado && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100"
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <User className="text-indigo-600" size={20} />
                    </div>
                    <span>{seleccionado.nombre}</span>
                  </h2>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 bg-white/80 px-3 py-2 rounded-lg">
                      <Calendar className="text-indigo-400" size={16} />
                      <span>Nacimiento: <span className="font-medium">{seleccionado.fecha_nacimiento}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-white/80 px-3 py-2 rounded-lg">
                      <Phone className="text-indigo-400" size={16} />
                      <span>Teléfono: <span className="font-medium">{seleccionado.telefono || 'No registrado'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-white/80 px-3 py-2 rounded-lg">
                      <Mail className="text-indigo-400" size={16} />
                      <span>Correo: <span className="font-medium">{seleccionado.correo || 'No registrado'}</span></span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/consultas?nuevo=1&paciente=${seleccionado.id}`)}
                  className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <Stethoscope size={18} />
                  <span>Nueva Consulta</span>
                </motion.button>
                
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clipboard className="text-indigo-500" size={18} />
                Historial Reciente
              </h3>
              
              {Array.isArray(historial) && historial.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-dashed border-gray-200">
                  <p className="text-gray-500 mb-3">No hay consultas registradas para este paciente.</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/consultas?nuevo=1&paciente=${seleccionado.id}`)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Registrar primera consulta
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(historial) && historial.slice(0, 3).map((h, index) => (
                    <motion.div 
                      key={h.id || index} 
                      whileHover={{ y: -2 }}
                      className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {new Date(h.fecha).toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Motivo:</span> {h.motivo}</p>
                          <p className="text-sm"><span className="font-medium">Antecedentes:</span> {h.antecedentes || 'Sin antecedentes registrados'}</p>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <Stethoscope size={12} /> Consulta
                        </span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Diagnóstico:</span> {h.diagnostico}
                        </p>

                        <p className="text-sm">
                          <span className="font-medium">Notas:</span> {h.notas || 'Sin notas'}
                        </p>

                        <div>
                          <p className="text-sm font-medium text-gray-700">Tratamiento:</p>
                          {h.tratamiento && h.tratamiento.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {h.tratamiento.map((med, index) => (
                                <li key={index}>
                                  <strong>{med.nombre}</strong>: {med.posologia}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No se registró tratamiento</p>
                          )}
                        </div>
                      </div>


                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
          </motion.section>
          
        )}

        {/* Dashboard de métricas mejorado */}
        <DashboardMetrics
          card1={
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pacientes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalPacientes}</p>
                  <p className="text-xs text-gray-400 mt-1">Total registrados</p>
                </div>
                <div className="bg-indigo-100/50 p-3 rounded-full border border-indigo-100">
                  <User className="text-indigo-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full" 
                    style={{ width: `${Math.min(100, totalPacientes)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          }

          card2={
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Consultas hoy</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{consultasHoy}</p>
                  <p className="text-xs text-gray-400 mt-1">Agendadas</p>
                </div>
                <div className="bg-blue-100/50 p-3 rounded-full border border-blue-100">
                  <Stethoscope className="text-blue-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" 
                    style={{ width: `${Math.min(100, consultasHoy * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          }

          card3={
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Recetas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{recetasGeneradas}</p>
                  <p className="text-xs text-gray-400 mt-1">Generadas</p>
                </div>
                <div className="bg-green-100/50 p-3 rounded-full border border-green-100">
                  <Pill className="text-green-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" 
                    style={{ width: `${Math.min(100, recetasGeneradas / 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          }

          card4={
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pacientes atendidos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{consultasHoy}</p>
                </div>
                <div className="bg-purple-100/50 p-3 rounded-full border border-purple-100">
                  <UserCheck className="text-purple-600" size={20} />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-xs text-gray-500 font-medium">
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-center">
                    🕗 {consultasPorFranja.mañana}
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-center">
                    🌤️ {consultasPorFranja.tarde}
                  </div>
                  <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-center">
                    🌙 {consultasPorFranja.noche}
                  </div>
                </div>
              </div>
            </div>
          }
        />



        {/* Acciones rápidas mejoradas */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-indigo-100 p-2 rounded-full">
              <Activity className="text-indigo-600" size={18} />
            </span>
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.button 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/consultas?nuevo=1')}
              className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center text-center group"
            >
              <div className="bg-indigo-100 p-3 rounded-full mb-3 group-hover:bg-indigo-200 transition-colors">
                <Stethoscope className="text-indigo-600 group-hover:text-indigo-700" size={20} />
              </div>
              <span className="font-medium text-gray-900">Nueva Consulta</span>
              <span className="text-sm text-gray-500 mt-1">Registrar una nueva consulta médica</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMostrarModal(true)}
              className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center text-center group"
            >
              <div className="bg-indigo-100 p-3 rounded-full mb-3 group-hover:bg-indigo-200 transition-colors">
                <User className="text-indigo-600 group-hover:text-indigo-700" size={20} />
              </div>
              <span className="font-medium text-gray-900">Nuevo Paciente</span>
              <span className="text-sm text-gray-500 mt-1">Agregar un nuevo paciente al sistema</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/historial')}
              className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center text-center group"
            >
              <div className="bg-indigo-100 p-3 rounded-full mb-3 group-hover:bg-indigo-200 transition-colors">
                <Clipboard className="text-indigo-600 group-hover:text-indigo-700" size={20} />
              </div>
              <span className="font-medium text-gray-900">Ver Historiales</span>
              <span className="text-sm text-gray-500 mt-1">Consultar historiales médicos completos</span>
            </motion.button>
            
            <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(
                    'http://127.0.0.1:8000/admin/',
                     '_blank',
                     'noopener,noreferrer'
                   )}                className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/30 transition-all flex flex-col items-center text-center group"
              >
                <div className="bg-green-100 p-3 rounded-full mb-3 group-hover:bg-green-200 transition-colors">
                  <ClipboardCheck className="text-green-600 group-hover:text-green-700" size={20} />
                </div>
                <span className="font-medium text-gray-900">Admin de Django</span>
                <span className="text-sm text-gray-500 mt-1">Ir al panel de administración</span>
              </motion.button>

          </div>
        </motion.section>
        
      </main>

      {/* Modal de nuevo paciente */}
      {mostrarModal && (
        <ModalNuevoPaciente
          datos={nuevoPaciente}
          onChange={(campo, valor) => setNuevoPaciente(prev => ({ ...prev, [campo]: valor }))}
          onClose={() => setMostrarModal(false)}
          onSave={async () => {
            try {
              const pacienteCreado = await crearPaciente(nuevoPaciente);
              if (pacienteCreado && pacienteCreado.id) {
                setMostrarModal(false);
                navigate(`/consultas?nuevo=1&paciente=${pacienteCreado.id}`);
              }
            } catch (error) {
              alert("Error al guardar el paciente.");
              console.error(error);
            }
          }}
        />
      )}
      <WidgetBienestar/>
    </div>
  );
}