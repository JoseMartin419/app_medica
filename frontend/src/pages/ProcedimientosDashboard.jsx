import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart,
} from 'recharts';
import { format, parseISO, subDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  FiPlusCircle, FiActivity, FiDatabase, 
  FiPieChart, FiDollarSign, 
  FiEdit2, FiTrash2, FiCheck, FiX, 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Autocomplete, TextField, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import Navbar from '../components/Navbar';

// --- PALETA DE COLORES TEMÁTICA ---
const THEME_COLORS = {
  primary: '#4F46E5', // indigo-600
  secondary: '#0EA5E9', // sky-500
  green: '#10B981', // emerald-500
  amber: '#F59E0B', // amber-500
  red: '#EF4444', // red-500
  violet: '#8B5CF6', // violet-500
  pie: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0ea5e9', '#64748b']
};

// --- COMPONENTES VISUALES REUTILIZABLES ---

const StatCard = ({ icon, title, value, detail, colorClass }) => (
  <motion.div 
    whileHover={{ scale: 1.03, y: -5 }}
    className={`bg-white rounded-xl shadow-md p-5 border-t-4 ${colorClass}`}
  >
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        <p className="text-sm text-slate-400 mt-2">{detail}</p>
      </div>
      {icon}
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // 'payload[0].payload' es nuestro objeto con 'detalles'
    const data = payload[0].payload;

    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 shadow-lg rounded-lg border border-slate-200">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-indigo-600">
          Procedimientos totales: <span className="font-semibold">{data.totalProcedimientos}</span>
        </p>
        <p className="text-green-600 mb-2">
          Ingresos: <span className="font-semibold">${data.totalIngresos.toLocaleString()}</span>
        </p>
        <div className="space-y-1">
          {data.detalles.map((d, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span style={{ color: d.color }}>{d.nombre}:</span>
              <span>
                {d.cantidad} ({`$${d.ingresos.toLocaleString()}`})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};


const ProcedimientosDashboard = () => {
  // Estados principales
  const [procedimientos, setProcedimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('daily');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState('Todos');

  // Tipos de procedimientos y precios
  const tiposProcedimientos = useMemo(() => [
    { nombre: 'Consulta', precio: 65, color: THEME_COLORS.pie[0] },
    { nombre: 'Aplicación', precio: 35, color: THEME_COLORS.pie[1] },
    { nombre: 'Consulta Nocturna', precio: 75, color: '#990099' },
    { nombre: 'Consulta dia festivo', precio: 75, color: '#990099' },
    { nombre: 'Toma de presión', precio: 30, color: THEME_COLORS.pie[2] },
    { nombre: 'Glucometría', precio: 50, color: THEME_COLORS.pie[3] },
    { nombre: 'Sutura', precio: 500, color: THEME_COLORS.pie[4] },
    { nombre: 'Retiro de implante', precio: 500, color: THEME_COLORS.pie[5] },
    { nombre: 'Certificado médico de buena salud', precio: 120, color: THEME_COLORS.pie[6] },
    { nombre: 'Lavado de oído', precio: 150, color: '#3366cc' },
    { nombre: 'Curaciones', precio: 200, color: '#dc3912' },
    { nombre: 'Control de niño sano', precio: 120, color: '#ff9900' },
    { nombre: 'Prueba COVID/Influenza', precio: 150, color: '#109618' },
    { nombre: 'Somatometría', precio: 30, color: '#990099' },
    { nombre: 'Retiro de Verrugas', precio: 150, color: '#990099' },
    { nombre: 'Retiro de puntos', precio: 150, color: '#990099' },
    { nombre: 'otro', precio: 50, color: '#990099' }
  ], []);

  // Estado del formulario
  const initialFormData = {
    fecha: format(new Date(), 'yyyy-MM-dd'),
    procedimientos: [],
    notas: '',
    pago: { metodo: 'Efectivo', monto: 0, completado: true }
  };
  const [formData, setFormData] = useState(initialFormData);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/registros/');
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        const data = await response.json();


      const registrosAdaptados = data.map(registro => ({
        id: registro.id,
        fecha: registro.fecha,
        procedimientos: registro.procedimientos.map(p => ({
          tipo: p.tipo,
          cantidad: p.cantidad,
          precioUnitario: tiposProcedimientos.find(t => t.nombre === p.tipo)?.precio || 0
        })),
        notas: registro.notas,
        pago: {
          metodo: registro.metodo_pago,
          monto: parseFloat(registro.total),
          completado: registro.estado_pago === 'Completado'
        }
      }));

      setProcedimientos(registrosAdaptados);
    } catch (error) {
      console.error('Error al cargar registros desde el backend:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    }, [fetchData]);
    

  const mesesDisponibles = [...new Set(
    procedimientos.map(p => format(parseISO(p.fecha), 'MMMM yyyy', { locale: es }))
  )];
  

  const resetFormAndState = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setEditMode(false);
    setCurrentEdit(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePagoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      pago: { ...prev.pago, [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const agregarProcedimiento = () => {
    setFormData(prev => ({
      ...prev,
      procedimientos: [...prev.procedimientos, { tipo: '', cantidad: 1, precioUnitario: 0 }]
    }));
  };

  const handleProcedimientoChange = (index, field, value) => {
    const updatedProcedimientos = [...formData.procedimientos];
    updatedProcedimientos[index][field] = field === 'cantidad' ? parseInt(value) || 0 : value;
    if (field === 'tipo') {
      const tipoSeleccionado = tiposProcedimientos.find(t => t.nombre === value);
      updatedProcedimientos[index].precioUnitario = tipoSeleccionado ? tipoSeleccionado.precio : 0;
    }
    setFormData(prev => ({ ...prev, procedimientos: updatedProcedimientos }));
  };

  const eliminarProcedimientoForm = (index) => {
    setFormData(prev => ({
      ...prev,
      procedimientos: prev.procedimientos.filter((_, i) => i !== index)
    }));
  };

  const calcularTotalForm = () => {
    return formData.procedimientos.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
  };

  const submitForm = async () => {
    const totalCalculado = calcularTotalForm();
  
    const procedimientosAgrupados = formData.procedimientos.reduce((acc, proc) => {
      const existente = acc.find(p => p.tipo === proc.tipo);
      if (existente) {
        existente.cantidad += proc.cantidad;
      } else {
        acc.push({ ...proc });
      }
      return acc;
    }, []);
  
    const payload = {
      fecha: formData.fecha,
      procedimientos: procedimientosAgrupados.map(p => ({
        tipo: p.tipo,
        cantidad: p.cantidad,
        fecha: formData.fecha
      })),
      notas: formData.notas,
      total: totalCalculado,
      metodo_pago: formData.pago.metodo,
      estado_pago: formData.pago.completado ? 'Completado' : 'Pendiente',
    };
  
    try {
      if (editMode && currentEdit) {
        const response = await fetch(`http://localhost:8000/api/registros/${currentEdit}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Error al actualizar el registro');
      } else {
        const response = await fetch('http://localhost:8000/api/registros/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Error al crear el registro');
      }
  
      await fetchData();
      resetFormAndState();
    } catch (error) {
      console.error('Error al guardar registro:', error);
    }
  };

  const editarRegistro = (registro) => {
    const procedimientosFiltrados = registro.procedimientos.map(p => ({
      tipo: p.tipo,
      cantidad: p.cantidad,
      precioUnitario: tiposProcedimientos.find(t => t.nombre === p.tipo)?.precio || 0
    }));
  
    setFormData({
      fecha: registro.fecha,
      procedimientos: procedimientosFiltrados,
      notas: registro.notas,
      pago: { ...registro.pago }
    });
  
    setCurrentEdit(registro.id);
    setEditMode(true);
    setShowForm(true);
  };

  const abrirConfirmDialog = (id) => {
    setItemToDelete(id);
    setConfirmDialog(true);
  };

  const eliminarRegistroConfirmado = async () => {
    if (!itemToDelete) return;
  
    try {
      const response = await fetch(`http://localhost:8000/api/registros/${itemToDelete}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar registro');
      
      await fetchData();
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setConfirmDialog(false);
      setItemToDelete(null);
    }
  };

  const getFilteredData = () => {
    const hoy = new Date();
    const diasAtras = parseInt(timeRange);
    const fechaLimite = subDays(hoy, diasAtras);
  
    return procedimientos.filter(p => {
      const fecha = parseISO(p.fecha);
      const coincideMes = mesSeleccionado === 'Todos' 
        || format(fecha, 'MMMM yyyy', { locale: es }) === mesSeleccionado;
  
      // Si el mes está seleccionado, sólo filtramos por mes
      if (mesSeleccionado !== 'Todos') {
        return coincideMes;
      }
  
      // Si no, aplicamos rango de días + mes “Todos”
      return fecha >= fechaLimite && fecha <= hoy;
    });
  };
  

  const procesarDatosGraficos = () => {
    const datosFiltrados = getFilteredData();
    const porFecha = {};
  
    datosFiltrados.forEach(p => {
      if (!porFecha[p.fecha]) {
        porFecha[p.fecha] = {
          fecha: p.fecha,
          fechaFormateada: format(parseISO(p.fecha), 'EEE dd MMM', { locale: es }),
          totalProcedimientos: 0,
          totalIngresos: 0,
          breakdown: {}      // inicializamos el objeto intermedio
        };
      }
      const entry = porFecha[p.fecha];
  
      // sumamos totales
      entry.totalProcedimientos += p.procedimientos.reduce((s, proc) => s + proc.cantidad, 0);
      entry.totalIngresos += p.pago.monto;
  
      // construimos el breakdown por tipo
      p.procedimientos.forEach(proc => {
        const key = proc.tipo;
        const precio = proc.precioUnitario;
        if (!entry.breakdown[key]) {
          entry.breakdown[key] = { cantidad: 0, ingresos: 0, color: tiposProcedimientos.find(t => t.nombre === key)?.color };
        }
        entry.breakdown[key].cantidad += proc.cantidad;
        entry.breakdown[key].ingresos += proc.cantidad * precio;
      });
    });
  
    // convertimos a array y añadimos el campo detalles
    return Object.values(porFecha)
      .map(e => ({
        fecha:           e.fecha,
        fechaFormateada: e.fechaFormateada,
        totalProcedimientos: e.totalProcedimientos,
        totalIngresos:        e.totalIngresos,
        detalles: Object.entries(e.breakdown).map(([nombre, { cantidad, ingresos, color }]) => ({
          nombre, cantidad, ingresos, color
        }))
      }))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  };
  

  const datosDistribucion = () => {
    const datosFiltrados = getFilteredData();
    const porTipo = {};
    datosFiltrados.forEach(p => {
      p.procedimientos.forEach(proc => {
        porTipo[proc.tipo] = (porTipo[proc.tipo] || 0) + proc.cantidad;
      });
    });
    return Object.entries(porTipo).map(([name, value]) => ({
      name,
      value,
      color: tiposProcedimientos.find(t => t.nombre === name)?.color || '#8884d8'
    })).sort((a,b) => b.value - a.value);
  };

  const datosIngresos = () => {
    const datosFiltrados = getFilteredData();
    const porFecha = {};
    datosFiltrados.forEach(p => {
      const fechaFormateada = format(parseISO(p.fecha), 'EEE dd MMM', { locale: es });
      if (!porFecha[p.fecha]) {
        porFecha[p.fecha] = {
          fecha: p.fecha,
          fechaFormateada: fechaFormateada,
          ingresos: 0,
        };
      }
      porFecha[p.fecha].ingresos += p.pago.monto;
    });
    return Object.values(porFecha).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  };

  const calcularEstadisticas = () => {
    const datosFiltrados = getFilteredData();
    const totalProcedimientos = datosFiltrados.reduce((sum, p) => sum + p.procedimientos.reduce((s, proc) => s + proc.cantidad, 0), 0);
    const totalIngresos = datosFiltrados.reduce((sum, p) => sum + p.pago.monto, 0);
    
    const numDiasUnicos = new Set(datosFiltrados.map(p => p.fecha)).size;
    const promedioDiario = numDiasUnicos > 0 ? Math.round(totalProcedimientos / numDiasUnicos) : 0;
    const promedioIngresos = numDiasUnicos > 0 ? Math.round(totalIngresos / numDiasUnicos) : 0;
    
    let tendencia = 'neutral';
    const ingresosDiarios = datosIngresos();
    if (ingresosDiarios.length >= 2) {
      const ultimo = ingresosDiarios[ingresosDiarios.length - 1].ingresos;
      const penultimo = ingresosDiarios[ingresosDiarios.length - 2].ingresos;
      if (ultimo > penultimo) tendencia = 'up';
      else if (ultimo < penultimo) tendencia = 'down';
    }
    
    return { totalProcedimientos, totalIngresos, promedioDiario, promedioIngresos, tendencia };
  };

  const ingresosPorMetodo = () => {
    const datosFiltrados = getFilteredData();
    const porMetodo = {};
    datosFiltrados.forEach(p => {
      porMetodo[p.pago.metodo] = (porMetodo[p.pago.metodo] || 0) + p.pago.monto;
    });
    return Object.entries(porMetodo).map(([name, value]) => ({
      name,
      value,
      color: name === 'Efectivo' ? '#4CAF50' : name === 'Tarjeta' ? '#2196F3' : '#9C27B0'
    })).sort((a,b) => b.value - a.value);
  };

  const ingresosPorDiaSemana = () => {
    const datosFiltrados = getFilteredData();
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const porDia = dias.map(dia => ({ name: dia, ingresos: 0 }));
    datosFiltrados.forEach(p => {
      const diaNum = parseISO(p.fecha).getDay();
      porDia[diaNum].ingresos += p.pago.monto;
    });
    return porDia;
  };

  const ingresosPorSemana = () => {
    const semanas = {};
    const datosFiltrados = getFilteredData();
    
    datosFiltrados.forEach(p => {
      const fecha = parseISO(p.fecha);
      const inicioSemana = startOfWeek(fecha, { locale: es });
      const semanaKey = format(inicioSemana, 'dd/MM/yy', { locale: es });
      
      if (!semanas[semanaKey]) {
        semanas[semanaKey] = {
          semana: semanaKey,
          ingresos: 0,
          fechaInicio: inicioSemana
        };
      }
      semanas[semanaKey].ingresos += p.pago.monto;
    });
    return Object.values(semanas).sort((a, b) => a.fechaInicio - b.fechaInicio);
  };

  const estadisticas = calcularEstadisticas();
  const datosGraficos = procesarDatosGraficos();
  const datosParaTorta = datosDistribucion();
  const datosIngresosGrafico = datosIngresos();
  const datosMetodoPago = ingresosPorMetodo();
  const datosDiaSemana = ingresosPorDiaSemana();
  const datosSemanales = ingresosPorSemana();

  const sortedProcedimientos = [...procedimientos].sort((a, b) => parseISO(b.fecha) - parseISO(a.fecha));

  const tabs = [
    { key: 'daily', label: 'Actividad Diaria' },
    { key: 'distribution', label: 'Distribución' },
    { key: 'weekday', label: 'Rendimiento Semanal' },
    { key: 'weekly', label: 'Ingresos Semanales' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Dashboard de Procedimientos</h1>
        <p className="text-slate-500 mt-1">Análisis de actividades clínicas e ingresos</p>
      </motion.div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiActivity className="text-blue-500 text-3xl opacity-80" />} 
          title="Procedimientos" 
          value={estadisticas.totalProcedimientos} 
          detail={`${estadisticas.promedioDiario} / día (prom)`} 
          colorClass="border-blue-500" 
        />
        <StatCard 
          icon={<FiDollarSign className="text-green-500 text-3xl opacity-80" />} 
          title="Ingresos" 
          value={`$${estadisticas.totalIngresos.toLocaleString()}`} 
          detail={`${estadisticas.promedioIngresos.toLocaleString()} / día (prom)`} 
          colorClass="border-green-500" 
        />
        <StatCard 
          icon={<FiPieChart className="text-violet-500 text-3xl opacity-80" />} 
          title="Tipos Proc." 
          value={datosParaTorta.length} 
          detail={`${tiposProcedimientos.length} tipos configurados`} 
          colorClass="border-violet-500" 
        />
        <StatCard 
          icon={<FiDatabase className="text-amber-500 text-3xl opacity-80" />} 
          title="Métodos Pago" 
          value={datosMetodoPago.length} 
          detail={datosMetodoPago.map(m => m.name).join(', ') || 'N/A'} 
          colorClass="border-amber-500" 
        />
      </div>
      
      {/* Sección principal de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal de gráficos */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Análisis Visual</h2>
                <p className="text-sm text-slate-500">Selecciona una vista para explorar los datos</p>
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)} 
                  className="p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="7">Últimos 7 días</option>
                  <option value="14">Últimos 14 días</option>
                  <option value="30">Últimos 30 días</option>
                  <option value="90">Últimos 90 días</option>
                </select>
                <select 
                  value={mesSeleccionado} 
                  onChange={(e) => setMesSeleccionado(e.target.value)} 
                  className="p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Todos">Todos los meses</option>
                  {mesesDisponibles.map((mes, i) => (
                    <option key={i} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex border-b border-slate-200 mb-4 overflow-x-auto">
              {tabs.map(tab => (
                <button 
                  key={tab.key} 
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 font-medium text-sm focus:outline-none whitespace-nowrap transition-colors relative ${activeTab === tab.key ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div 
                      className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-600" 
                      layoutId="underline" 
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ y: 10, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: -10, opacity: 0 }} 
                transition={{ duration: 0.2 }} 
                style={{ height: '400px' }}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                  </div>
                ) : activeTab === 'daily' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={datosGraficos} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="fechaFormateada" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: 'Procedimientos', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12, dy: 60 }} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value/1000}k`} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '14px' }} />
                      <Bar yAxisId="left" dataKey="totalProcedimientos" name="Procedimientos" radius={[4, 4, 0, 0]} fill={THEME_COLORS.primary} barSize={20} />
                      <Line yAxisId="right" type="monotone" dataKey="totalIngresos" name="Ingresos" stroke={THEME_COLORS.green} strokeWidth={2.5} dot={{ r: 4, fill: THEME_COLORS.green }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : activeTab === 'distribution' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={datosParaTorta} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={80} 
                        outerRadius={130} 
                        paddingAngle={2}
                      >
                        {datosParaTorta.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color || THEME_COLORS.pie[index % THEME_COLORS.pie.length]} 
                            stroke="none" 
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : activeTab === 'weekday' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosDiaSemana} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="ingresos" fill={THEME_COLORS.violet} radius={[4, 4, 0, 0]} name="Ingresos" barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosSemanales} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="semana" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="ingresos" stroke={THEME_COLORS.amber} strokeWidth={3} dot={{ r: 5, fill: THEME_COLORS.amber }} activeDot={{ r: 7 }} name="Ingresos Semanales" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Columna lateral de acciones y lista */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => { 
                setEditMode(false); 
                setCurrentEdit(null); 
                setFormData(initialFormData); 
                setShowForm(true); 
              }}
              variant="contained" 
              startIcon={<FiPlusCircle />}
              fullWidth
              sx={{
                py: 1.5,
                bgcolor: THEME_COLORS.primary,
                '&:hover': { bgcolor: '#4338CA' },
                borderRadius: '0.75rem',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 14px 0 rgb(0 0 0 / 10%)'
              }}
            >
              Nuevo Registro
            </Button>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Registros Recientes</h2>
            {loading ? (
              <div className="text-center text-slate-500">Cargando...</div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                {sortedProcedimientos.slice(0, 10).map(registro => (
                  <div 
                    key={registro.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-700">${registro.pago.monto.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">
                        {format(parseISO(registro.fecha), 'EEE, dd MMM yyyy', { locale: es })}
                      </p>
                      <div className="mt-1">
                        <Chip 
                          label={registro.pago.completado ? 'Completado' : 'Pendiente'} 
                          color={registro.pago.completado ? 'success' : 'warning'} 
                          size="small" 
                          variant="outlined" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <IconButton 
                        onClick={() => editarRegistro(registro)} 
                        title="Editar"
                      >
                        <FiEdit2 size={16} className="text-slate-500 hover:text-indigo-600" />
                      </IconButton>
                      <IconButton 
                        onClick={() => abrirConfirmDialog(registro.id)} 
                        title="Eliminar"
                      >
                        <FiTrash2 size={16} className="text-slate-500 hover:text-red-600" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Formulario en diálogo */}
      <Dialog open={showForm} onClose={resetFormAndState} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, m: 0 }}>
          <span className="font-bold text-2xl text-slate-800">
            {editMode ? 'Editar Registro' : 'Nuevo Registro'}
          </span>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#f8fafc', p: 3 }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <TextField 
                type="date" 
                name="fecha" 
                value={formData.fecha} 
                onChange={handleInputChange}
                fullWidth 
                size="small"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Procedimientos Realizados</label>
                <Button 
                  onClick={agregarProcedimiento} 
                  startIcon={<FiPlusCircle />} 
                  size="small"
                >
                  Agregar
                </Button>
              </div>
              
              {formData.procedimientos.length === 0 ? (
                <p className="text-slate-400 italic text-sm py-2 text-center">
                  Aún no se han agregado procedimientos.
                </p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {formData.procedimientos.map((proc, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-slate-50 rounded-lg border">
                      <div className="col-span-12 sm:col-span-5">
                        <Autocomplete
                          options={tiposProcedimientos}
                          getOptionLabel={(option) => `${option.nombre} ($${option.precio})`}
                          value={tiposProcedimientos.find(t => t.nombre === proc.tipo) || null}
                          onChange={(_, newValue) => handleProcedimientoChange(index, 'tipo', newValue ? newValue.nombre : '')}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Tipo" 
                              variant="outlined" 
                              size="small" 
                            />
                          )}
                          fullWidth
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <TextField
                          type="number"
                          label="Cant."
                          value={proc.cantidad}
                          onChange={(e) => handleProcedimientoChange(index, 'cantidad', e.target.value)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          inputProps={{ min: 1 }}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <TextField
                          label="Precio U."
                          value={proc.precioUnitario}
                          variant="outlined"
                          size="small"
                          fullWidth
                          disabled
                        />
                      </div>

                      <div className="col-span-12 sm:col-span-1 flex justify-end sm:justify-center">
                        <IconButton 
                          onClick={() => eliminarProcedimientoForm(index)} 
                          color="error" 
                          size="small"
                        >
                          <FiTrash2 />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-700">Total Estimado:</span>
                <span className="text-xl font-bold text-blue-800">
                  ${calcularTotalForm().toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-slate-700 mb-3">Información de Pago</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Método</label>
                  <TextField 
                    select 
                    name="metodo" 
                    value={formData.pago.metodo} 
                    onChange={handlePagoChange} 
                    fullWidth 
                    size="small" 
                    SelectProps={{ native: true }}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                  </TextField>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monto Pagado</label>
                  <TextField 
                    type="number" 
                    name="monto" 
                    value={formData.pago.monto} 
                    onChange={handlePagoChange} 
                    fullWidth 
                    size="small" 
                    inputProps={{ min: 0, step: "0.01" }} 
                  />
                </div>
                <div className="flex items-center pt-5">
                  <input 
                    type="checkbox" 
                    name="completado" 
                    id="completado" 
                    checked={formData.pago.completado} 
                    onChange={handlePagoChange} 
                    className="mr-2 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                  />
                  <label htmlFor="completado" className="text-sm font-medium text-slate-700">
                    Pago Completado
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notas Adicionales</label>
              <TextField 
                name="notas" 
                value={formData.notas} 
                onChange={handleInputChange} 
                multiline 
                rows={3} 
                fullWidth 
                size="small" 
                placeholder="Observaciones, diagnósticos, etc." 
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2, bgcolor: '#f8fafc' }}>
          <Button onClick={resetFormAndState} startIcon={<FiX />}>
            Cancelar
          </Button>
          <Button 
            onClick={submitForm} 
            startIcon={<FiCheck />} 
            variant="contained" 
            disabled={formData.procedimientos.length === 0 || calcularTotalForm() <= 0}
          >
            {editMode ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancelar</Button>
          <Button onClick={eliminarRegistroConfirmado} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabla de historial completo */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">Historial Completo</h2>
        <p className="text-sm text-slate-500 mb-6">Listado de todas las consultas y procedimientos registrados.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b-2 border-slate-200">
              <tr>
                {['Fecha', 'Procedimientos', 'Total', 'Método', 'Estado', 'Acciones'].map(header => (
                  <th key={header} className="py-4 px-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedProcedimientos.map((registro) => (
                <tr key={registro.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                    {format(parseISO(registro.fecha), 'dd MMM yyyy', { locale: es })}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 max-w-xs">
                    {registro.procedimientos.map(p => `${p.tipo} (${p.cantidad})`).join(', ')}
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-slate-800 whitespace-nowrap">
                    ${registro.pago.monto.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 whitespace-nowrap">
                    {registro.pago.metodo}
                  </td>
                  <td className="py-4 px-4 text-sm whitespace-nowrap">
                    <Chip 
                      label={registro.pago.completado ? 'Completado' : 'Pendiente'} 
                      color={registro.pago.completado ? 'success' : 'warning'} 
                      size="small" 
                      variant="outlined"
                    />
                  </td>
                  <td className="py-4 px-4 text-sm whitespace-nowrap">
                    <IconButton 
                      onClick={() => editarRegistro(registro)} 
                      color="primary" 
                      size="small" 
                      title="Editar"
                    >
                      <FiEdit2 size={16} />
                    </IconButton>
                    <IconButton 
                      onClick={() => abrirConfirmDialog(registro.id)} 
                      color="error" 
                      size="small" 
                      title="Eliminar"
                    >
                      <FiTrash2 size={16} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcedimientosDashboard;