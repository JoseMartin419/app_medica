import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { obtenerPacientes, crearConsulta } from '../api/pacientes';
import { Decimal } from 'decimal.js';
import { 
  Activity, Clipboard, User, HeartPulse, Ruler, Weight, 
  Syringe, Thermometer, Eye, Plus, Stethoscope, AlertTriangle, X,
  ChevronLeft, FileText, Pill, Clock, Calendar, AlertCircle, Phone, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import medicamentos from '../data/medicamentos';
import { reglasPosologia } from '../data/posologias';
import DiagnosticoSelect from "../components/DiagnosticoSelect";
import { obtenerHistorialPorPaciente } from '../api/pacientes';





export default function Consultas() {
  const [, setPacientes] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [busquedaMedFrecuente, setBusquedaMedFrecuente] = useState('');
  const [sugerenciasFrecuentes, setSugerenciasFrecuentes] = useState([]);
  
  
  const [pacienteActual, setPacienteActual] = useState(null);
  const [consulta, setConsulta] = useState({
    paciente: '',
    motivo: '',
    antecedentes: '',
    peso: '',
    talla: '',
    imc: '',
    frecuencia_cardiaca: '',
    frecuencia_respiratoria: '',
    presion_arterial: '',
    glucometria: '',
    oximetria: '',
    temperatura: '',
    diagnostico: '',
    tratamiento: [],
    medico: '',
    notas: ''
  });

  const [medicamentoActual, setMedicamentoActual] = useState({ 
    nombre: '', 
    posologia: '',
    duracion: ''
  });

  const [activeTab, setActiveTab] = useState('signos');
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const pacienteId = params.get('paciente');

  const buscarMedicamentosFrecuentes = async (query) => {
    if (!query.trim()) {
      setSugerenciasFrecuentes([]);
      return;
    }
    try {
      const response = await fetch(`/api/medicamentos-frecuentes/?search=${encodeURIComponent(query)}`);
      if (response.ok) {
        const resultados = await response.json();
        setSugerenciasFrecuentes(resultados);
      }
    } catch (error) {
      console.error('Error al buscar medicamentos frecuentes:', error);
    }
  };
  

  //------------------------------------------
  const [mostrarExpediente, setMostrarExpediente] = useState(false);
  const [historial, setHistorial] = useState([]);

  const cargarHistorial = async (id) => {
    try {
      const data = await obtenerHistorialPorPaciente(id);
      setHistorial(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setHistorial([]);
    }
  };
  
  
  
  

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const data = await obtenerPacientes();
        setPacientes(data);
        if (pacienteId) {
          const encontrado = data.find(p => p.id === parseInt(pacienteId));
          if (encontrado) {
            setPacienteActual(encontrado);
            setConsulta(prev => ({ ...prev, paciente: encontrado.id }));
          }
        }
      } catch (error) {
        console.error("Error de red al obtener pacientes:", error);
      }
    };
    cargarPacientes();
  }, [pacienteId]);


  useEffect(() => {
    if (medicamentoActual.nombre.length > 0) {
      const texto = medicamentoActual.nombre.toLowerCase();
      const sugeridas = medicamentos.filter((m) =>
        m.label.toLowerCase().includes(texto)
      ).slice(0, 5);
      setSugerencias(sugeridas);
    } else {
      setSugerencias([]);
    }
  }, [medicamentoActual.nombre]);
  

  useEffect(() => {
    if (medicamentoActual.nombre.length > 0) {
      const texto = medicamentoActual.nombre.toLowerCase();
      const sugeridas = medicamentos.filter((m) =>
        m.label.toLowerCase().includes(texto)
      ).slice(0, 5);
      setSugerencias(sugeridas);
  
      // 📌 Detectar si el medicamento tiene regla
      const clave = Object.keys(reglasPosologia).find(k =>
        medicamentoActual.nombre.toLowerCase().includes(k.toLowerCase())
      );
  
      if (clave && consulta.peso) {
        const regla = reglasPosologia[clave];
        const textoGenerado = regla.texto(parseFloat(consulta.peso));
        setMedicamentoActual(prev => ({ ...prev, posologia: textoGenerado }));
      }
    } else {
      setSugerencias([]);
    }
  }, [medicamentoActual.nombre, consulta.peso]);
  


  const rangosNormales = {
    frecuencia_cardiaca: { min: 60, max: 100, icon: <HeartPulse size={16} />, unidad: 'lpm' },
    frecuencia_respiratoria: { min: 12, max: 20, icon: <Activity size={16} />, unidad: 'rpm' },
    glucometria: { min: 70, max: 140, icon: <Syringe size={16} />, unidad: 'mg/dL' },
    oximetria: { min: 95, max: 100, icon: <Thermometer size={16} />, unidad: '%' },
    temperatura: { min: 36.5, max: 37.5, icon: <Thermometer size={16} />, unidad: '°C' },
    presion_arterial: { min: 90, max: 120, min2: 60, max2: 80, icon: <Activity size={16} />, unidad: 'mmHg' },
    imc: { min: 18.5, max: 24.9, icon: <Weight size={16} />, unidad: 'kg/m²' }
  };

  const fueraDeRango = (campo, valor) => {
    if (!valor) return false;
    const numValor = parseFloat(valor);
    if (isNaN(numValor)) return false;
    
    if (campo === 'presion_arterial') {
      const partes = valor.split('/');
      if (partes.length !== 2) return true;
      const sistolica = parseFloat(partes[0]);
      const diastolica = parseFloat(partes[1]);
      return (sistolica < rangosNormales.presion_arterial.min || 
              sistolica > rangosNormales.presion_arterial.max ||
              diastolica < rangosNormales.presion_arterial.min2 || 
              diastolica > rangosNormales.presion_arterial.max2);
    }
    
    return numValor < rangosNormales[campo].min || 
           numValor > (rangosNormales[campo].max || Infinity);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nuevaConsulta = { ...consulta, [name]: value };
    
    if (name === 'peso' || name === 'talla') {
      const peso = name === 'peso' ? parseFloat(value) : parseFloat(nuevaConsulta.peso);
      const tallaCm = name === 'talla' ? parseFloat(value) : parseFloat(nuevaConsulta.talla);
    
      if (peso > 0 && tallaCm > 0) {
        const tallaM = tallaCm / 100;
        const imc = (peso / (tallaM * tallaM)).toFixed(2);
        nuevaConsulta.imc = imc;
      }
    
      // Nuevo: actualizamos el peso en el estado para que esté disponible
      nuevaConsulta.peso = peso;
    }
    
    
    if (name === 'presion_arterial') {
      const cleaned = value.replace(/[^0-9]/g, '');
      if (cleaned.length <= 3) {
        nuevaConsulta.presion_arterial = cleaned;
      } else if (cleaned.length <= 6) {
        nuevaConsulta.presion_arterial = `${cleaned.slice(0, 3)}/${cleaned.slice(3)}`;
      }
    }
    
    setConsulta(nuevaConsulta);
  };

  const agregarMedicamento = () => {
    if (medicamentoActual.nombre && medicamentoActual.posologia) {
      setConsulta(prev => ({
        ...prev,
        tratamiento: [...(prev.tratamiento || []), medicamentoActual]
      }));
      setMedicamentoActual({ nombre: '', posologia: '', duracion: '' });
    }
  };

  const removerMedicamento = (index) => {
    setConsulta(prev => ({
      ...prev,
      tratamiento: prev.tratamiento.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const decimalOrNull = (val) => {
      try {
        if (val === '' || val === null || val === undefined || isNaN(val)) return null;
        return new Decimal(val).toFixed(2);
      } catch {
        return null;
      }
    };

    const intOrNull = (val) => {
      const parsed = parseInt(val);
      return isNaN(parsed) ? null : parsed;
    };

    const consultaLimpia = {
      ...consulta,
      peso: decimalOrNull(consulta.peso),
      talla: decimalOrNull(consulta.talla),
      imc: decimalOrNull(consulta.imc),
      frecuencia_cardiaca: intOrNull(consulta.frecuencia_cardiaca),
      frecuencia_respiratoria: intOrNull(consulta.frecuencia_respiratoria),
      glucometria: intOrNull(consulta.glucometria),
      oximetria: intOrNull(consulta.oximetria),
      temperatura: decimalOrNull(consulta.temperatura)
    };

    if (!consultaLimpia.paciente) {
      alert("No se ha asignado el paciente.");
      return;
    }

    try {
      const consultaGuardada = await crearConsulta({
        ...consultaLimpia,
        paciente_id: consultaLimpia.paciente
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      if (consultaGuardada.url_receta) {
        window.open(`http://localhost:8000${consultaGuardada.url_receta}`, '_blank');
      }

      setConsulta({
        ...consulta,
        motivo: '', antecedentes: '', peso: '', talla: '', imc: '',
        frecuencia_cardiaca: '', frecuencia_respiratoria: '', presion_arterial: '',
        glucometria: '', oximetria: '', temperatura: '', diagnostico: '', 
        tratamiento: [], medico: '', notas: ''
      });
    } catch (error) {
      console.error("Error al registrar consulta:", error);
    }
  };

  const interpretarIMC = (imc) => {
    if (!imc) return '';
    const valor = parseFloat(imc);
    if (valor < 18.5) return 'Bajo peso';
    if (valor < 25) return 'Normal';
    if (valor < 30) return 'Sobrepeso';
    if (valor < 35) return 'Obesidad grado I';
    if (valor < 40) return 'Obesidad grado II';
    return 'Obesidad grado III';
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'signos':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="text-blue-500" size={20} />
              Registro de Signos Vitales
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Weight size={16} className="text-gray-500" />
                  Peso (kg)
                </label>
                <div className="relative">
                  <input
                    name="peso"
                    value={consulta.peso}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                    placeholder="70.5"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">kg</span>
                  </div>
                </div>
              </div>

              {/* Talla */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Ruler size={16} className="text-gray-500" />
                  Talla (cm)
                </label>
                <div className="relative">
                  <input
                    name="talla"
                    value={consulta.talla}
                    onChange={handleChange}
                    type="number"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                    placeholder="170"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">cm</span>
                  </div>
                </div>
              </div>

              {/* IMC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Weight size={16} className="text-gray-500" />
                  IMC
                </label>
                <div className="relative">
                  <input
                    name="imc"
                    value={consulta.imc}
                    readOnly
                    className={`block w-full rounded-md border-gray-300 shadow-sm pl-10 bg-gray-50 ${consulta.imc && fueraDeRango('imc', consulta.imc) ? 'border-red-300 text-red-600' : ''}`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">___________kg/m²</span>
                  </div>
                  {consulta.imc && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span className={`text-xs font-medium ${fueraDeRango('imc', consulta.imc) ? 'text-red-600' : 'text-green-600'}`}>
                        {interpretarIMC(consulta.imc)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Frecuencia Cardíaca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <HeartPulse size={16} className="text-gray-500" />
                  Frec. Cardíaca
                </label>
                <div className="relative">
                  <input
                    name="frecuencia_cardiaca"
                    value={consulta.frecuencia_cardiaca}
                    onChange={handleChange}
                    type="number"
                    className={`block w-full rounded-md ${fueraDeRango('frecuencia_cardiaca', consulta.frecuencia_cardiaca) ? 'border-red-300 text-red-600' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10`}
                    placeholder="72"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">lpm</span>
                  </div>
                  {fueraDeRango('frecuencia_cardiaca', consulta.frecuencia_cardiaca) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertTriangle size={16} className="text-red-500" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Rango normal: 60-100 lpm
                </p>
              </div>

              {/* Presión Arterial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Activity size={16} className="text-gray-500" />
                  Presión Arterial
                </label>
                <div className="relative">
                  <input
                    name="presion_arterial"
                    value={consulta.presion_arterial}
                    onChange={handleChange}
                    type="text"
                    className={`block w-full rounded-md ${fueraDeRango('presion_arterial', consulta.presion_arterial) ? 'border-red-300 text-red-600' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10`}
                    placeholder="120/80 mmHg"
                    maxLength="7"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500"></span>
                  </div>
                  {fueraDeRango('presion_arterial', consulta.presion_arterial) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertTriangle size={16} className="text-red-500" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Rango normal: 90-120/60-80 mmHg
                </p>
              </div>

              {/* Temperatura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Thermometer size={16} className="text-gray-500" />
                  Temperatura
                </label>
                <div className="relative">
                  <input
                    name="temperatura"
                    value={consulta.temperatura}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                    className={`block w-full rounded-md ${fueraDeRango('temperatura', consulta.temperatura) ? 'border-red-300 text-red-600' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10`}
                    placeholder="36.8"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">°C</span>
                  </div>
                  {fueraDeRango('temperatura', consulta.temperatura) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertTriangle size={16} className="text-red-500" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Rango normal: 36.5-37.5 °C
                </p>
              </div>
            </div>
          </div>
        );
      case 'consulta':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clipboard className="text-blue-500" size={20} />
              Información de la Consulta
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de la consulta
                </label>
                <textarea
                  name="motivo"
                  value={consulta.motivo}
                  onChange={handleChange}
                  rows="2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describa el motivo principal de la consulta..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Antecedentes relevantes
                </label>
                <textarea
                  name="antecedentes"
                  value={consulta.antecedentes}
                  onChange={handleChange}
                  rows="2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enfermedades previas, alergias, cirugías, etc."
                />
              </div>

              <DiagnosticoSelect
                value={consulta.diagnostico}
                onChange={(val) =>
                  setConsulta((prev) => ({ ...prev, diagnostico: val }))
                }
              />


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  name="notas"
                  value={consulta.notas}
                  onChange={handleChange}
                  rows="2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Observaciones, recomendaciones, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Médico que atendió
                </label>
                <input
                  name="medico"
                  value={consulta.medico}
                  onChange={handleChange}
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nombre del médico"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 'tratamiento':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Pill className="text-blue-500" size={20} />
              Tratamiento Médico
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicamento
                </label>
                <div className="relative">
              <input
                type="text"
                value={medicamentoActual.nombre}
                onChange={(e) => {
                  const nuevoNombre = e.target.value;
                  setMedicamentoActual(prev => {
                    const peso = parseFloat(consulta.peso) || 0;
                    const key = nuevoNombre.toLowerCase().trim();
                
                    const regla = reglasPosologia[key];
                    const posologiaCalculada = (regla && peso > 0) ? regla.texto(peso) : prev.posologia;
                
                    return {
                      ...prev,
                      nombre: nuevoNombre,
                      posologia: posologiaCalculada
                    };
                  });
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nombre del medicamento"
                autoComplete="off"
              />

              {sugerencias.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                  {sugerencias.map((med, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        const nombre = med.label;
                        const clave = nombre.toLowerCase();
                        let posologia = '';
                      
                        if (reglasPosologia[clave] && pacienteActual?.peso) {
                          posologia = reglasPosologia[clave].texto(parseFloat(pacienteActual.peso));
                        }
                      
                        setMedicamentoActual(prev => ({
                          ...prev,
                          nombre,
                          posologia
                        }));
                        setSugerencias([]);
                      }}
                      
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                    >
                      {med.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posología
                </label>
                <input
                  type="text"
                  value={medicamentoActual.posologia}
                  onChange={(e) => setMedicamentoActual(prev => ({ ...prev, posologia: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Dosis y frecuencia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración
                </label>
                <input
                  type="text"
                  value={medicamentoActual.duracion}
                  onChange={(e) => setMedicamentoActual(prev => ({ ...prev, duracion: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: 7 días"
                />
              </div>

              <div className="mt-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar medicamento frecuente
                </label>
                <input
                  type="text"
                  value={busquedaMedFrecuente}
                  onChange={(e) => {
                    const nuevoTexto = e.target.value;
                    setBusquedaMedFrecuente(nuevoTexto);
                    buscarMedicamentosFrecuentes(nuevoTexto);  // 🔹 búsqueda en vivo
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Escribe para buscar..."
                  autoComplete="off"
                />

                {sugerenciasFrecuentes.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {sugerenciasFrecuentes.map((med) => (
                      <li
                        key={med.id}
                        onClick={() => {
                          setMedicamentoActual(prev => ({
                            ...prev,
                            nombre: med.nombre,
                            posologia: med.posologia || ''
                          }));
                          setBusquedaMedFrecuente('');
                          setSugerenciasFrecuentes([]);
                        }}
                        className="p-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                      >
                        <span className="font-medium">{med.nombre}</span>
                        {med.posologia && <span className="block text-xs text-gray-500">{med.posologia}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>




            </div>

            <button
              type="button"
              onClick={agregarMedicamento}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Agregar Medicamento
            </button>

            {consulta.tratamiento?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Medicamentos prescritos
                </h4>
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {consulta.tratamiento.map((med, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <Pill className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <span className="ml-2 flex-1 w-0 truncate">
                          <span className="font-medium">{med.nombre}</span> - {med.posologia}
                          {med.duracion && ` (${med.duracion})`}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          className="text-indigo-500 hover:text-indigo-700 ml-4"
                          title="Ver detalle"
                          onClick={() => alert(`Medicamento: ${med.nombre}\nPosología: ${med.posologia}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removerMedicamento(index)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      <Navbar />
      
      <section className="pt-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header con navegación */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Volver</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Stethoscope className="text-blue-600" size={28} />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Nueva Consulta
            </span>
          </h1>
          
          <div className="w-20"></div>
        </div>
        
        {/* Tarjeta de paciente */}
        {pacienteActual && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-500"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{pacienteActual.nombre}</h2>
                </div>
  
                {(() => {
                  function calcularEdadDetallada(fechaNacimiento) {
                    if (!fechaNacimiento) return 'Desconocida';
                    const hoy = new Date();
                    const nacimiento = new Date(fechaNacimiento);
                  
                    let años = hoy.getFullYear() - nacimiento.getFullYear();
                    let meses = hoy.getMonth() - nacimiento.getMonth();
                  
                    if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
                      años--;
                      meses += 12;
                    }
                  
                    if (hoy.getDate() < nacimiento.getDate()) {
                      meses--;
                    }
                  
                    if (años <= 0) {
                      return `${meses} meses`;
                    } else if (meses > 0) {
                      return `${años} años y ${meses} meses`;
                    } else {
                      return `${años} años`;
                    }
                  }
  
                  const edadTexto = calcularEdadDetallada(pacienteActual.fecha_nacimiento);
                  const edadNum = parseInt(edadTexto);
                  const mostrarTutor = !isNaN(edadNum) && edadNum < 18 && pacienteActual.tutor;
  
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>Nac: {pacienteActual.fecha_nacimiento}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span>Edad: {edadTexto}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span>{pacienteActual.telefono || 'Sin teléfono'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span>{pacienteActual.correo || 'Sin correo'}</span>
                      </div>
                      {mostrarTutor && (
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span>Tutor: {pacienteActual.tutor}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2"> 
                <div className="flex gap-3">
                <button 
                    onClick={() => {
                      cargarHistorial(pacienteActual.id);
                      setMostrarExpediente(true);
                    }}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    <FileText size={16} />
                    <span>Ver expediente</span>
                  </button>

                </div>
              </div>
            </div>
          </motion.div>
        )}
  
        {/* Formulario principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Pestañas */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('signos')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'signos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Activity size={16} />
                Signos Vitales
              </button>
              <button
                onClick={() => setActiveTab('consulta')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'consulta' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Clipboard size={16} />
                Información Clínica
              </button>
              <button
                onClick={() => setActiveTab('tratamiento')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'tratamiento' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Pill size={16} />
                Tratamiento
              </button>
            </nav>
          </div>
  
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {renderTabContent()}
  
            {/* Navegación entre pestañas */}
            <div className="mt-8 flex justify-between">
              {activeTab !== 'signos' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'tratamiento' ? 'consulta' : 'signos')
                  }
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Anterior
                </button>
              )}
  
              {activeTab === 'signos' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('consulta')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-auto"
                >
                  Siguiente
                </button>
              )}
  
              {activeTab === 'consulta' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('tratamiento')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-auto"
                >
                  Siguiente
                </button>
              )}
  
              {activeTab === 'tratamiento' && (
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-auto"
                >
                  <Clipboard className="-ml-1 mr-3 h-5 w-5" />
                  Guardar Consulta
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
  
      {/* Notificación de éxito */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-green-100 p-2 rounded-full">
                <Clipboard className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Consulta registrada con éxito
              </h3>
              <p className="mt-1 text-sm text-green-700">
                La información de la consulta ha sido guardada correctamente.
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="text-sm font-medium text-green-700 hover:text-green-600 focus:outline-none"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

{mostrarExpediente && (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[80vh]">
      <button 
        onClick={() => setMostrarExpediente(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-4">Expediente de {pacienteActual.nombre}</h2>

      {historial.length === 0 ? (
        <p className="text-gray-500">No hay consultas registradas para este paciente.</p>
      ) : (
        <div className="space-y-4">
          {historial.map((h, index) => (
            <div key={index} className="border p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-800">
                {new Date(h.fecha).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </h3>
              <p><strong>Motivo:</strong> {h.motivo}</p>
              <p><strong>Antecedentes:</strong> {h.antecedentes || 'Sin antecedentes registrados'}</p>
              <p><strong>Diagnóstico:</strong> {h.diagnostico}</p>
              <p><strong>Notas:</strong> {h.notas || 'Sin notas'}</p>
              <div>
                <p className="font-medium">Tratamiento:</p>
                {h.tratamiento?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {h.tratamiento.map((med, i) => (
                      <li key={i}><strong>{med.nombre}</strong>: {med.posologia}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No se registró tratamiento</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
)}

    </div>
  );}

