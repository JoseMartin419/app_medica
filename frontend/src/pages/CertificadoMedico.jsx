import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Button, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// --- INLINE SVG ICONS (Replaces react-icons/fi) ---
const Icon = ({ children, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

const FiPrinter = (props) => <Icon {...props}><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></Icon>;
const FiRefreshCw = (props) => <Icon {...props}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></Icon>;
const FiUser = (props) => <Icon {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></Icon>;
const FiBriefcase = (props) => <Icon {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></Icon>;
const FiFileText = (props) => <Icon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></Icon>;
const FiHeart = (props) => <Icon {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></Icon>;
const FiChevronsDown = (props) => <Icon {...props}><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></Icon>;
const FiCpu = (props) => <Icon {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></Icon>;
const FiPlusCircle = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></Icon>;
const FiZap = (props) => <Icon {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></Icon>;

// --- THEME CUSTOMIZATION FOR MUI ---
const theme = createTheme({
  palette: {
    primary: { main: '#007BFF' },
    secondary: { main: '#6c757d' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const CertificadoMedico = () => {
  const generateInitialFormData = () => ({
    // Doctor's Info
    doctorNombre: 'Dr. José Martín González Durán',
    doctorCedula: '12949813',
    doctorEspecialidad: 'Medicina General',
    doctorTitulo: 'Médico Cirujano y Partero',
    doctorUniversidad: 'Universidad Autónoma de Nuevo León',
    clinicaNombre: 'Consultorio Médico Fundacion Best',
    clinicaDireccion: 'Paseo de San Juan #374, C.P: 67254, Ciudad Benito Juárez, N.L.',
    clinicaTelefono: '',
    // Patient's Info
    pacienteNombre: '',
    pacienteEdad: '',
    pacienteSexo: 'Masculino',
    pacienteFechaNacimiento: '',
    // Vital Signs & Anthropometry
    tensionArterial: '120/80',
    frecuenciaCardiaca: '75',
    frecuenciaRespiratoria: '18',
    temperatura: '36.5',
    saturacionOxigeno: '98',
    peso: '',
    talla: '',
    imc: '',
    // Certificate Details
    fechaExpedicion: format(new Date(), 'yyyy-MM-dd'),
    padecimientoActual: 'Refiere buen estado general, sin sintomatología aguda.',
    exploracionFisica: 'Paciente consciente, orientado en tiempo, persona y espacio. Hidratado, con buena coloración de tegumentos. Campos pulmonares bien ventilados, sin ruidos agregados. Ruidos cardíacos rítmicos, sin soplos. Abdomen blando, no doloroso a la palpación.',
    diagnostico: 'Clínicamente sano.',
    recomendaciones: 'Mantener hábitos de vida saludables, incluyendo dieta balanceada y actividad física regular.',
    folio: `CM-PRO-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  const [formData, setFormData] = useState(generateInitialFormData());
  const [isGenerating, setIsGenerating] = useState({ exploracion: false, recomendaciones: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePrint = () => window.print();
  const handleReset = () => setFormData(generateInitialFormData());

  const calculateAge = (dob) => {
    if (!dob) return '';
    try {
        const birthDate = new Date(dob + 'T00:00:00');
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age >= 0 ? age : '';
    } catch { return ''; }
  };
  
  const calculateBMI = (weight, height) => {
      if (!weight || !height) return '';
      const heightInMeters = parseFloat(height) / 100;
      if (heightInMeters === 0) return '';
      const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
      return bmi > 0 ? bmi.toFixed(1) : '';
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, pacienteEdad: calculateAge(prev.pacienteFechaNacimiento).toString() }));
  }, [formData.pacienteFechaNacimiento]);
  
  useEffect(() => {
    setFormData(prev => ({...prev, imc: calculateBMI(prev.peso, prev.talla)}));
  }, [formData.peso, formData.talla]);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "________________";
    try {
      return format(new Date(dateString + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch { return "Fecha inválida"; }
  };
  
  // --- GEMINI API INTEGRATION ---
  const callGemini = async (prompt) => {
    const apiKey = ""; // Dejar vacío, gestionado por el entorno de Canvas
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo obtener respuesta.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Error al contactar la IA. Verifique la conexión o inténtelo más tarde.";
    }
  };

  const handleAIAssist = async (field) => {
    setIsGenerating(prev => ({...prev, [field]: true}));
    let prompt = "";
    if (field === 'exploracion' && formData.diagnostico) {
      prompt = `Actúa como un médico. Basado en el diagnóstico "${formData.diagnostico}", redacta un resumen conciso de una exploración física esperada para un certificado médico. Sé profesional y técnico. Ejemplo: "Paciente consciente, orientado. Sin hallazgos patológicos relevantes a la auscultación cardiopulmonar. Abdomen blando, no doloroso."`;
    } else if (field === 'recomendaciones' && formData.diagnostico) {
      prompt = `Actúa como un médico. Para el diagnóstico "${formData.diagnostico}", genera 2 o 3 recomendaciones claras y breves para un paciente en un certificado médico. Ejemplo: "Mantener reposo relativo, asegurar adecuada hidratación."`;
    } else {
        setIsGenerating(prev => ({...prev, [field]: false}));
        alert("Por favor, ingrese un diagnóstico para que la IA pueda ayudar.");
        return;
    }
    
    const result = await callGemini(prompt);
    setFormData(prev => ({...prev, [field === 'exploracion' ? 'exploracionFisica' : 'recomendaciones']: result}));
    setIsGenerating(prev => ({...prev, [field]: false}));
  };

  return (
    
    <ThemeProvider theme={theme}>
         
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 font-sans">
          
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #999; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .printable-area {
            position: absolute !important; top: 0; left: 0; width: 100%; height: auto;
            margin: 0 !important; padding: 10mm !important; box-shadow: none !important;
            border: none !important; font-size: 10pt !important;
          }
          .print-bg-logo {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
            opacity: 0.05 !important; z-index: -1; pointer-events: none;
            width: 80vw;
          }
        }
      `}</style>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 no-print">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Certificado Médico Profesional</h1>
        <p className="text-gray-600 mt-1">Plataforma de generación de certificados con asistencia de IA.</p>
      </motion.div>

      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} lg={5} className="no-print">
          <Paper elevation={0} className="p-1 sm:p-2 space-y-4 rounded-2xl bg-white border border-gray-200">
            <div className="p-4 flex flex-col sm:flex-row gap-3">
              <Button fullWidth variant="contained" startIcon={<FiPrinter />} onClick={handlePrint}>Imprimir</Button>
              <Button fullWidth variant="outlined" startIcon={<FiRefreshCw />} onClick={handleReset}>Limpiar</Button>
            </div>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<FiChevronsDown />}><Typography className="font-semibold flex items-center gap-2"><FiBriefcase />Datos del Médico y Clínica</Typography></AccordionSummary>
              <AccordionDetails><Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><TextField label="Nombre del Médico" name="doctorNombre" value={formData.doctorNombre} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Cédula Profesional" name="doctorCedula" value={formData.doctorCedula} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={12}><TextField label="Nombre de la Clínica" name="clinicaNombre" value={formData.clinicaNombre} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={12}><TextField label="Dirección de la Clínica" name="clinicaDireccion" value={formData.clinicaDireccion} onChange={handleChange} fullWidth size="small" /></Grid>
              </Grid></AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<FiChevronsDown />}><Typography className="font-semibold flex items-center gap-2"><FiUser />Datos del Paciente</Typography></AccordionSummary>
              <AccordionDetails><Grid container spacing={2}>
                  <Grid item xs={12}><TextField label="Nombre Completo" name="pacienteNombre" value={formData.pacienteNombre} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Fecha de Nacimiento" name="pacienteFechaNacimiento" type="date" value={formData.pacienteFechaNacimiento} onChange={handleChange} fullWidth size="small" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6} sm={3}><TextField label="Edad" name="pacienteEdad" value={formData.pacienteEdad} InputProps={{readOnly: true}} fullWidth size="small" /></Grid>
                  <Grid item xs={6} sm={3}><TextField label="Sexo" name="pacienteSexo" value={formData.pacienteSexo} onChange={handleChange} select fullWidth size="small" SelectProps={{ native: true }}>
                      <option>Masculino</option><option>Femenino</option><option>Otro</option>
                  </TextField></Grid>
              </Grid></AccordionDetails>
            </Accordion>
             <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<FiChevronsDown />}><Typography className="font-semibold flex items-center gap-2"><FiHeart />Signos Vitales y Antropometría</Typography></AccordionSummary>
              <AccordionDetails><Grid container spacing={2}>
                  <Grid item xs={6} sm={4}><TextField label="T.A. (mmHg)" name="tensionArterial" value={formData.tensionArterial} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={6} sm={4}><TextField label="F.C. (lpm)" name="frecuenciaCardiaca" value={formData.frecuenciaCardiaca} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={6} sm={4}><TextField label="F.R. (rpm)" name="frecuenciaRespiratoria" value={formData.frecuenciaRespiratoria} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={6} sm={4}><TextField label="Temp (°C)" name="temperatura" value={formData.temperatura} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={6} sm={4}><TextField label="Sat O2 (%)" name="saturacionOxigeno" value={formData.saturacionOxigeno} onChange={handleChange} fullWidth size="small" /></Grid>
                  <Grid item xs={6} sm={4}><TextField label="Peso (kg)" name="peso" value={formData.peso} onChange={handleChange} fullWidth size="small" type="number" /></Grid>
                  <Grid item xs={6} sm={4}><TextField label="Talla (cm)" name="talla" value={formData.talla} onChange={handleChange} fullWidth size="small" type="number" /></Grid>
                  <Grid item xs={6} sm={8}><TextField label="IMC (kg/m²)" name="imc" value={formData.imc} InputProps={{readOnly: true}} fullWidth size="small" /></Grid>
              </Grid></AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<FiChevronsDown />}><Typography className="font-semibold flex items-center gap-2"><FiFileText />Contenido del Certificado</Typography></AccordionSummary>
              <AccordionDetails><Grid container spacing={2}>
                  <Grid item xs={12}><TextField label="Padecimiento Actual" name="padecimientoActual" value={formData.padecimientoActual} onChange={handleChange} fullWidth multiline minRows={2} size="small" /></Grid>
                  <Grid item xs={12}><TextField label="Diagnóstico(s)" name="diagnostico" value={formData.diagnostico} onChange={handleChange} fullWidth multiline minRows={2} size="small" /></Grid>
                  <Grid item xs={12}>
                    <div className="relative">
                        <TextField label="Exploración Física" name="exploracionFisica" value={formData.exploracionFisica} onChange={handleChange} fullWidth multiline minRows={4} size="small" />
                        <Button size="small" onClick={() => handleAIAssist('exploracion')} disabled={isGenerating.exploracion} className="!absolute !top-1 !right-1 flex items-center gap-1"><FiCpu size={14}/> {isGenerating.exploracion ? 'Generando...' : 'Asistencia IA'}</Button>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="relative">
                        <TextField label="Recomendaciones" name="recomendaciones" value={formData.recomendaciones} onChange={handleChange} fullWidth multiline minRows={3} size="small" />
                        <Button size="small" onClick={() => handleAIAssist('recomendaciones')} disabled={isGenerating.recomendaciones} className="!absolute !top-1 !right-1 flex items-center gap-1"><FiCpu size={14}/> {isGenerating.recomendaciones ? 'Generando...' : 'Asistencia IA'}</Button>
                    </div>
                  </Grid>
              </Grid></AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>

        {/* Certificate Preview Section */}
        <Grid item xs={12} lg={7}>
          <Paper elevation={3} className="p-2 sm:p-4 rounded-2xl printable-area bg-white relative">
            {/* Background Logo for Print */}
            <FiPlusCircle className="text-blue-500 print-bg-logo hidden print:block" />
            <div className="border border-gray-200 p-4 sm:p-6 min-h-[800px] text-gray-800 flex flex-col">
              {/* Header */}
              <header className="flex items-center gap-4 border-b border-gray-200 pb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <FiPlusCircle size={32} />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-blue-800">{formData.clinicaNombre}</h2>
                    <p className="font-semibold text-gray-700">{formData.doctorNombre}</p>
                    <p className="text-xs text-gray-500">{formData.doctorEspecialidad} — Céd. Prof. {formData.doctorCedula}</p>
                </div>
              </header>
              
              <main className="flex-grow my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-4 text-sm">
                  <div className="text-center mb-6">
                    <p className="font-bold text-xl tracking-wider">CERTIFICADO MÉDICO</p>
                  </div>
                  {/* Patient Data */}
                  <div>
                    <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Paciente</p>
                    <div className="mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="font-bold text-base">{formData.pacienteNombre || "Nombre del Paciente"}</p>
                      <div className="flex gap-x-4 text-xs mt-1">
                        <span><span className="font-semibold">Edad:</span> {formData.pacienteEdad || '__'} años</span>
                        <span><span className="font-semibold">Sexo:</span> {formData.pacienteSexo}</span>
                      </div>
                    </div>
                  </div>
                  {/* Certificate Body */}
                  <div className="space-y-3">
                    <div><p><span className="font-semibold">Padecimiento Actual: </span>{formData.padecimientoActual}</p></div>
                    <div>
                        <p className="font-semibold">Exploración Física:</p>
                        <div className="max-h-28 overflow-y-auto custom-scrollbar pr-2 mt-1 text-gray-600 text-justify">
                            {formData.exploracionFisica}
                        </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200"><p><span className="font-semibold">Diagnóstico: </span>{formData.diagnostico}</p></div>
                    <div>
                        <p className="font-semibold">Recomendaciones:</p>
                        <div className="max-h-28 overflow-y-auto custom-scrollbar pr-2 mt-1 text-gray-600 text-justify">
                            {formData.recomendaciones}
                        </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="md:col-span-1 md:border-l md:pl-6 border-gray-200/80 space-y-4">
                    <div>
                        <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Folio</p>
                        <p className="font-mono text-blue-700 font-semibold">{formData.folio}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Fecha de Expedición</p>
                        <p className="font-semibold">{formatDateForDisplay(formData.fechaExpedicion)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-2 flex items-center gap-2"><FiZap/>Signos Vitales</p>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                          <p><strong>T.A:</strong> {formData.tensionArterial} mmHg</p>
                          <p><strong>F.C:</strong> {formData.frecuenciaCardiaca} lpm</p>
                          <p><strong>F.R:</strong> {formData.frecuenciaRespiratoria} rpm</p>
                          <p><strong>Temp:</strong> {formData.temperatura} °C</p>
                          <p><strong>Sat O₂:</strong> {formData.saturacionOxigeno} %</p>
                          <p><strong>Peso:</strong> {formData.peso} kg</p>
                          <p><strong>Talla:</strong> {formData.talla} cm</p>
                          <p><strong>IMC:</strong> {formData.imc}</p>
                        </div>
                    </div>
                </aside>
              </main>

              {/* Footer */}
              <footer className="pt-6 border-t border-gray-200 mt-auto">
                <div className="text-center">
                    <div className="w-3/4 h-12 mx-auto border-b border-gray-400"></div>
                    <p className="font-semibold mt-1">{formData.doctorNombre}</p>
                    <p className="text-xs">{formData.doctorTitulo}</p>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">{formData.clinicaDireccion}</p>
              </footer>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
    </ThemeProvider>
  );
};

export default CertificadoMedico;
