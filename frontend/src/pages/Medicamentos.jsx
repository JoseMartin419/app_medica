import { useState } from 'react';
import medicamentos from '../data/medicamentos';
import { Link } from 'react-router-dom';
import { 
  Menu, X, Activity, Home, FilePlus, FolderOpenDot, 
  Pill, Search, ChevronLeft, ChevronRight, Stethoscope, BarChart3, Clipboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MedicamentosDeConcurso from '../components/medicamentos/MedicamentosDeConcurso';

export default function Medicamentos() {
  const [busqueda, setBusqueda] = useState('');
  const [open, setOpen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const medicamentosPorPagina = 20;

  const quitarAcentos = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const texto = quitarAcentos(busqueda.toLowerCase());

  const resultados = medicamentos.filter(med => {
    // Usamos el encadenamiento opcional para evitar el error si 'descripcion' o 'sustancia' son undefined
    const label = quitarAcentos(med.label.toLowerCase());
    const descripcion = quitarAcentos(med.descripcion?.toLowerCase() || '');
    const sustancia = quitarAcentos(med.sustancia?.toLowerCase() || '');
    return label.includes(texto) || descripcion.includes(texto) || sustancia.includes(texto);
  });

  const indiceInicial = (paginaActual - 1) * medicamentosPorPagina;
  const indiceFinal = indiceInicial + medicamentosPorPagina;
  const medicamentosPagina = resultados.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(resultados.length / medicamentosPorPagina);

  const resaltar = (textoOriginal, textoBusqueda) => {
    if (!textoBusqueda) return textoOriginal;
    const textoSinAcentos = quitarAcentos(textoOriginal.toLowerCase());
    const busquedaSinAcentos = quitarAcentos(textoBusqueda.toLowerCase());
    const inicio = textoSinAcentos.indexOf(busquedaSinAcentos);
    if (inicio === -1) return textoOriginal;
    const fin = inicio + textoBusqueda.length;
    return (
      <>
        {textoOriginal.slice(0, inicio)}
        <span className="bg-yellow-200 font-semibold">
          {textoOriginal.slice(inicio, fin)}
        </span>
        {textoOriginal.slice(fin)}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
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
                <Link to="/medicamentos" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-2 transition-all duration-200 bg-indigo-50 text-indigo-700">
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
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-3 transition-all bg-indigo-50 text-indigo-700"
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

      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Catálogo de Medicamentos
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Busca y selecciona medicamentos para crear recetas médicas
          </p>
        </div>

        {/* Barra de búsqueda mejorada */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o sustancia activa..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // Resetear a primera página al buscar
            }}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-sm text-gray-500">
              {resultados.length} resultados
            </span>
          </div>
        </div>

        {/* Contenedor Flex para la tabla principal y MedicamentosDeConcurso */}
        <div className="flex flex-col lg:flex-row gap-6"> {/* flex-col en móvil, flex-row en lg+ */}
          {/* Tabla de medicamentos - Ocupará el espacio principal */}
          <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                      Medicamento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicamentosPagina.length > 0 ? (
                    medicamentosPagina.map((med, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {resaltar(med.label, busqueda)}
                          </div>
                          {med.sustancia && (
                            <div className="text-xs text-gray-500 mt-1">
                              {resaltar(med.sustancia, busqueda)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {resaltar(med.descripcion, busqueda)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* No hay acción */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        No se encontraron medicamentos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación mejorada de la tabla principal */}
            {totalPaginas > 1 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                    disabled={paginaActual === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{indiceInicial + 1}</span> a{' '}
                      <span className="font-medium">{Math.min(indiceFinal, resultados.length)}</span> de{' '}
                      <span className="font-medium">{resultados.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                        disabled={paginaActual === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Anterior</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                        let pageNum;
                        if (totalPaginas <= 5) {
                          pageNum = i + 1;
                        } else if (paginaActual <= 3) {
                          pageNum = i + 1;
                        } else if (paginaActual >= totalPaginas - 2) {
                          pageNum = totalPaginas - 4 + i;
                        } else {
                          pageNum = paginaActual - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPaginaActual(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              paginaActual === pageNum
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                        disabled={paginaActual === totalPaginas}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Siguiente</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MedicamentosDeConcurso - Ocupará una porción más pequeña a la derecha */}
          <div className="lg:w-1/3"> {/* Ajusta el ancho según tu preferencia */}
            <MedicamentosDeConcurso />
          </div>
        </div> {/* Fin del contenedorr Flex */}
      </section>
    </div>
  );
}