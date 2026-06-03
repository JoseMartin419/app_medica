import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Grid, Paper, Typography,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import sello from "../assets/SelloDoctorJose.png";
import firma from "../assets/firma.png";
import dancingScriptFont from "../assets/DancingScript-VariableFont_wght.ttf";

const NAVY   = '#1B2B5B';
const GOLD   = '#B8962E';
const SOFT   = '#EEF2FF';

const theme = createTheme({
  palette: { primary: { main: NAVY }, secondary: { main: GOLD } },
  typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: '8px' } } } },
    MuiButton:    { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none', fontWeight: 600 } } },
    MuiAccordion: { styleOverrides: { root: { boxShadow: 'none', borderBottom: '1px solid #E5E7EB', '&:before': { display: 'none' } } } },
  },
});

const Icon = ({ children, size = 18, ...p }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {children}
  </svg>
);
const IcoPrint   = (p) => <Icon {...p}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></Icon>;
const IcoRefresh = (p) => <Icon {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></Icon>;
const IcoChevron = (p) => <Icon {...p}><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></Icon>;
const IcoUser    = (p) => <Icon {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>;
const IcoBrief   = (p) => <Icon {...p}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>;
const IcoFile    = (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Icon>;
const IcoHeart   = (p) => <Icon {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Icon>;
const IcoAI      = (p) => <Icon {...p}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></Icon>;

const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  @font-face {
    font-family: 'DancingScript';
    src: url('${dancingScriptFont}') format('truetype');
    font-weight: 400 700;
  }

  /* ══════════════ PRINT ══════════════ */
  @page {
    size: letter portrait;
    margin: 0;
  }

  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

    html, body {
      margin: 0; padding: 0;
      background: white !important;
      font-family: 'Inter', sans-serif;
    }

    .no-print { display: none !important; }

    /* Certificate floats over everything, full-page */
    .cert-print-wrapper {
      position: absolute !important;
      top: 0 !important; left: 0 !important;
      width: 100% !important;
      background: white !important;
      z-index: 9999;
      padding: 0 !important;
      box-sizing: border-box !important;
    }

    /* Remove any MUI box-shadow or border-radius */
    .cert-paper {
      box-shadow: none !important;
      border-radius: 0 !important;
      border: none !important;
    }

    /* Let long text expand naturally */
    .cert-text-expand {
      max-height: none !important;
      overflow: visible !important;
    }

    /* Avoid orphaned section headings */
    .cert-section { break-inside: avoid; page-break-inside: avoid; }
  }
`;

const CertificadoMedico = () => {
  const newFolio = () => `CM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const blank = () => ({
    doctorNombre:       'Dr. José Martín González Durán',
    doctorCedula:       '12949813',
    doctorEspecialidad: 'Medicina General',
    doctorTitulo:       'Médico Cirujano y Partero',
    doctorUniversidad:  'Universidad Autónoma de Nuevo León',
    clinicaNombre:      'Consultorio Médico Fundación Best',
    clinicaDireccion:   'Paseo de San Juan #374, C.P. 67254, Cd. Benito Juárez, N.L.',
    pacienteNombre:     '',
    pacienteEdad:       '',
    pacienteSexo:       'Masculino',
    pacienteFechaNacimiento: '',
    tensionArterial:    '120/80',
    frecuenciaCardiaca: '75',
    frecuenciaRespiratoria: '18',
    temperatura:        '36.5',
    saturacionOxigeno:  '98',
    peso: '', talla: '', imc: '',
    fechaExpedicion: format(new Date(), 'yyyy-MM-dd'),
    padecimientoActual:
      'Refiere buen estado general, sin sintomatología aguda al momento de la valoración.',
    exploracionFisica:
      'Paciente consciente, orientado en tiempo, persona y espacio. Hidratado, con buena coloración de tegumentos. Campos pulmonares bien ventilados, sin ruidos agregados. Ruidos cardíacos rítmicos, sin soplos audibles. Abdomen blando, no doloroso a la palpación, sin datos de irritación peritoneal. Extremidades sin edema.',
    diagnostico:     'Clínicamente sano.',
    recomendaciones: 'Mantener hábitos de vida saludables: dieta balanceada, hidratación adecuada y actividad física regular de al menos 30 minutos diarios.',
    folio: newFolio(),
  });

  const [form, setForm] = useState(blank());
  const [gen, setGen]   = useState({ exploracion: false, recomendaciones: false });

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const age = (dob) => {
    if (!dob) return '';
    try {
      const b = new Date(dob + 'T00:00:00'), t = new Date();
      let a = t.getFullYear() - b.getFullYear();
      const m = t.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
      return a >= 0 ? String(a) : '';
    } catch { return ''; }
  };

  const bmi = (w, h) => {
    if (!w || !h) return '';
    const hm = parseFloat(h) / 100;
    if (!hm) return '';
    const v = parseFloat(w) / (hm * hm);
    return v > 0 ? v.toFixed(1) : '';
  };

  useEffect(() => {
    setForm(p => ({ ...p, pacienteEdad: age(p.pacienteFechaNacimiento) }));
  }, [form.pacienteFechaNacimiento]);

  useEffect(() => {
    setForm(p => ({ ...p, imc: bmi(p.peso, p.talla) }));
  }, [form.peso, form.talla]);

  const showDate = (s) => {
    if (!s) return '________________';
    try { return format(new Date(s + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: es }); }
    catch { return 'Fecha inválida'; }
  };

  const callGemini = async (prompt) => {
    const apiKey = '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      return d.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta.';
    } catch { return 'Error al contactar la IA.'; }
  };

  const handleAI = async (field) => {
    if (!form.diagnostico) { alert('Ingrese un diagnóstico primero.'); return; }
    setGen(p => ({ ...p, [field]: true }));
    const prompts = {
      exploracion:     `Actúa como médico. Con diagnóstico "${form.diagnostico}", redacta una exploración física concisa y técnica en español para un certificado médico.`,
      recomendaciones: `Actúa como médico. Para el diagnóstico "${form.diagnostico}", redacta 2-3 recomendaciones médicas breves en español.`,
    };
    const result = await callGemini(prompts[field]);
    setForm(p => ({ ...p, [field === 'exploracion' ? 'exploracionFisica' : 'recomendaciones']: result }));
    setGen(p => ({ ...p, [field]: false }));
  };

  const vitales = [
    { l: 'T.A.',    v: form.tensionArterial,       u: 'mmHg' },
    { l: 'F.C.',    v: form.frecuenciaCardiaca,     u: 'lpm'  },
    { l: 'F.R.',    v: form.frecuenciaRespiratoria, u: 'rpm'  },
    { l: 'Temp.',   v: form.temperatura,            u: '°C'   },
    { l: 'Sat. O₂', v: form.saturacionOxigeno,     u: '%'    },
    { l: 'Peso',    v: form.peso,                   u: 'kg'   },
    { l: 'Talla',   v: form.talla,                  u: 'cm'   },
    { l: 'IMC',     v: form.imc,                    u: 'kg/m²'},
  ].filter(x => x.v);

  /* ── shared cell style ── */
  const labelCell = { color: '#6B7280', fontWeight: 600, paddingRight: '6mm', whiteSpace: 'nowrap', fontSize: '9pt', verticalAlign: 'top', paddingBottom: '2mm' };
  const valueCell = { color: '#111827', fontSize: '9pt', verticalAlign: 'top', paddingBottom: '2mm' };

  /* ── section heading style ── */
  const secHead = {
    color: NAVY, fontWeight: 700, fontSize: '8pt',
    textTransform: 'uppercase', letterSpacing: '1px',
    marginBottom: '2mm',
    borderBottom: `2px solid ${GOLD}`,
    paddingBottom: '1.5mm',
    display: 'block',
  };

  return (
    <ThemeProvider theme={theme}>
      <style>{PRINT_STYLES}</style>

      <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '24px', fontFamily: 'Inter, sans-serif' }}>

        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="no-print" style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1F2937', margin: 0 }}>
            Certificado Médico
          </h1>
          <p style={{ color: '#6B7280', marginTop: '6px', fontSize: '13px' }}>
            Al imprimir: desactiva <strong>"Encabezados y pies de página"</strong> en el diálogo de impresión para eliminar las leyendas del navegador.
          </p>
        </motion.div>

        <Grid container spacing={3}>

          {/* ══════════════ FORM ══════════════ */}
          <Grid item xs={12} lg={5} className="no-print">
            <Paper elevation={0} style={{ borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>

              {/* Buttons */}
              <div style={{ padding: '16px', display: 'flex', gap: '12px', borderBottom: '1px solid #F3F4F6' }}>
                <Button fullWidth variant="contained" startIcon={<IcoPrint />}
                  onClick={() => window.print()}
                  style={{ background: NAVY }}>
                  Imprimir
                </Button>
                <Button fullWidth variant="outlined" startIcon={<IcoRefresh />}
                  onClick={() => setForm(blank())} style={{ borderColor: '#D1D5DB', color: '#374151' }}>
                  Limpiar
                </Button>
              </div>

              {/* Doctor */}
              <Accordion defaultExpanded disableGutters>
                <AccordionSummary expandIcon={<IcoChevron />}>
                  <Typography style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IcoBrief /> Médico y Clínica
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={7}><TextField label="Nombre del médico" name="doctorNombre" value={form.doctorNombre} onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={12} sm={5}><TextField label="Cédula" name="doctorCedula" value={form.doctorCedula} onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Especialidad" name="doctorEspecialidad" value={form.doctorEspecialidad} onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Título" name="doctorTitulo" value={form.doctorTitulo} onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={12}><TextField label="Nombre de la clínica" name="clinicaNombre" value={form.clinicaNombre} onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={12}><TextField label="Dirección" name="clinicaDireccion" value={form.clinicaDireccion} onChange={handle} fullWidth size="small" /></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Patient */}
              <Accordion defaultExpanded disableGutters>
                <AccordionSummary expandIcon={<IcoChevron />}>
                  <Typography style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IcoUser /> Paciente
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><TextField label="Nombre completo" name="pacienteNombre" value={form.pacienteNombre} onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Fecha de nacimiento" name="pacienteFechaNacimiento" type="date"
                        value={form.pacienteFechaNacimiento} onChange={handle} fullWidth size="small"
                        InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}><TextField label="Edad" value={form.pacienteEdad} InputProps={{ readOnly: true }} fullWidth size="small" /></Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField label="Sexo" name="pacienteSexo" value={form.pacienteSexo} onChange={handle}
                        select fullWidth size="small" SelectProps={{ native: true }}>
                        <option>Masculino</option><option>Femenino</option><option>Otro</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Vital signs */}
              <Accordion defaultExpanded disableGutters>
                <AccordionSummary expandIcon={<IcoChevron />}>
                  <Typography style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IcoHeart /> Signos Vitales
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4}><TextField label="T.A. (mmHg)"  name="tensionArterial"       value={form.tensionArterial}       onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={6} sm={4}><TextField label="F.C. (lpm)"   name="frecuenciaCardiaca"    value={form.frecuenciaCardiaca}    onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={6} sm={4}><TextField label="F.R. (rpm)"   name="frecuenciaRespiratoria"value={form.frecuenciaRespiratoria}onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={6} sm={4}><TextField label="Temp (°C)"    name="temperatura"           value={form.temperatura}           onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={6} sm={4}><TextField label="Sat O₂ (%)"  name="saturacionOxigeno"     value={form.saturacionOxigeno}     onChange={handle} fullWidth size="small" /></Grid>
                    <Grid item xs={6} sm={4}><TextField label="Peso (kg)"    name="peso"                  value={form.peso}                  onChange={handle} fullWidth size="small" type="number" /></Grid>
                    <Grid item xs={6} sm={4}><TextField label="Talla (cm)"   name="talla"                 value={form.talla}                 onChange={handle} fullWidth size="small" type="number" /></Grid>
                    <Grid item xs={6} sm={8}><TextField label="IMC (kg/m²)" value={form.imc} InputProps={{ readOnly: true }} fullWidth size="small" /></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Content */}
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<IcoChevron />}>
                  <Typography style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IcoFile /> Contenido del Certificado
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><TextField label="Padecimiento actual" name="padecimientoActual" value={form.padecimientoActual} onChange={handle} fullWidth multiline minRows={2} size="small" /></Grid>
                    <Grid item xs={12}><TextField label="Diagnóstico(s)" name="diagnostico" value={form.diagnostico} onChange={handle} fullWidth multiline minRows={2} size="small" /></Grid>
                    <Grid item xs={12}>
                      <div style={{ position: 'relative' }}>
                        <TextField label="Exploración Física" name="exploracionFisica" value={form.exploracionFisica} onChange={handle} fullWidth multiline minRows={3} size="small" />
                        <Button size="small" disabled={gen.exploracion} onClick={() => handleAI('exploracion')}
                          style={{ position: 'absolute', top: 4, right: 4, fontSize: '11px', minWidth: 0, padding: '2px 8px' }}>
                          <IcoAI size={12} style={{ marginRight: 4 }} />{gen.exploracion ? 'Generando…' : 'IA'}
                        </Button>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div style={{ position: 'relative' }}>
                        <TextField label="Recomendaciones" name="recomendaciones" value={form.recomendaciones} onChange={handle} fullWidth multiline minRows={3} size="small" />
                        <Button size="small" disabled={gen.recomendaciones} onClick={() => handleAI('recomendaciones')}
                          style={{ position: 'absolute', top: 4, right: 4, fontSize: '11px', minWidth: 0, padding: '2px 8px' }}>
                          <IcoAI size={12} style={{ marginRight: 4 }} />{gen.recomendaciones ? 'Generando…' : 'IA'}
                        </Button>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Folio" name="folio" value={form.folio} onChange={handle} fullWidth size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Fecha de expedición" name="fechaExpedicion" type="date"
                        value={form.fechaExpedicion} onChange={handle} fullWidth size="small"
                        InputLabelProps={{ shrink: true }} />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

            </Paper>
          </Grid>

          {/* ══════════════ CERTIFICATE PREVIEW ══════════════ */}
          <Grid item xs={12} lg={7}>
            <div className="cert-print-wrapper">
              <Paper className="cert-paper" elevation={4}
                style={{ borderRadius: '10px', overflow: 'hidden', background: 'white', fontFamily: 'Inter, sans-serif' }}>

                {/* Content with screen padding (print padding comes from .cert-print-wrapper) */}
                <div style={{ padding: '10mm 12mm' }}>

                  {/* TOP ACCENT */}
                  <div style={{ height: '7px', background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 65%, ${GOLD} 100%)`, marginBottom: '7mm' }} />

                  {/* ─── HEADER ─── */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8mm', marginBottom: '6mm' }}>
                    {/* Cross icon as logo placeholder */}
                    <div style={{
                      width: '50px', height: '50px', flexShrink: 0,
                      background: NAVY, borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    </div>

                    {/* Clinic & Doctor */}
                    <div style={{ flex: 1 }}>
                      <div style={{ color: NAVY, fontSize: '14pt', fontWeight: 700, letterSpacing: '0.3px', lineHeight: 1.2 }}>
                        {form.clinicaNombre}
                      </div>
                      <div style={{ color: '#374151', fontSize: '11pt', fontWeight: 600, marginTop: '1mm' }}>
                        {form.doctorNombre}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '8.5pt', marginTop: '0.5mm' }}>
                        {form.doctorTitulo} · {form.doctorEspecialidad}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '8pt' }}>
                        Cédula Profesional: {form.doctorCedula} · {form.doctorUniversidad}
                      </div>
                      <div style={{ color: '#9CA3AF', fontSize: '8pt', marginTop: '0.5mm' }}>
                        {form.clinicaDireccion}
                      </div>
                    </div>

                    {/* Date & Folio */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color: '#9CA3AF', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Expedición</div>
                      <div style={{ color: '#111827', fontSize: '9pt', fontWeight: 600 }}>{showDate(form.fechaExpedicion)}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '2mm' }}>Folio</div>
                      <div style={{ color: NAVY, fontFamily: 'monospace', fontSize: '11pt', fontWeight: 700 }}>{form.folio}</div>
                    </div>
                  </div>

                  {/* ─── TITLE BAR ─── */}
                  <div style={{
                    background: NAVY, color: 'white',
                    textAlign: 'center', padding: '5px 0',
                    fontSize: '12pt', fontWeight: 700, letterSpacing: '4px',
                    borderRadius: '4px', marginBottom: '6mm',
                  }}>
                    CERTIFICADO MÉDICO
                  </div>

                  {/* ─── PATIENT + VITALS ROW ─── */}
                  <div style={{ display: 'flex', gap: '5mm', marginBottom: '5mm' }} className="cert-section">

                    {/* Patient card */}
                    <div style={{ flex: 3, border: '1px solid #E5E7EB', borderRadius: '6px', padding: '4mm' }}>
                      <span style={secHead}>Datos del Paciente</span>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr>
                            <td style={labelCell}>Nombre:</td>
                            <td style={{ ...valueCell, fontWeight: 700, fontSize: '10pt' }} colSpan={3}>
                              {form.pacienteNombre || '___________________________________'}
                            </td>
                          </tr>
                          <tr>
                            <td style={labelCell}>Edad:</td>
                            <td style={valueCell}>{form.pacienteEdad ? `${form.pacienteEdad} años` : '____'}</td>
                            <td style={{ ...labelCell, paddingLeft: '6mm' }}>Sexo:</td>
                            <td style={valueCell}>{form.pacienteSexo}</td>
                          </tr>
                          {form.pacienteFechaNacimiento && (
                            <tr>
                              <td style={labelCell}>Nac.:</td>
                              <td style={valueCell} colSpan={3}>
                                {format(new Date(form.pacienteFechaNacimiento + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Vitals card */}
                    {vitales.length > 0 && (
                      <div style={{ flex: 2, border: '1px solid #E5E7EB', borderRadius: '6px', padding: '4mm' }}>
                        <span style={secHead}>Signos Vitales</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '4mm', rowGap: '1.5mm' }}>
                          {vitales.map(({ l, v, u }) => (
                            <div key={l} style={{ fontSize: '8.5pt' }}>
                              <span style={{ color: '#6B7280', fontWeight: 600 }}>{l}: </span>
                              <span style={{ fontWeight: 600 }}>{v}</span>
                              <span style={{ color: '#9CA3AF', fontSize: '7.5pt' }}> {u}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ─── LEGAL INTRO ─── */}
                  <p style={{ fontSize: '9pt', color: '#374151', textAlign: 'justify', lineHeight: 1.6, marginBottom: '4mm' }}>
                    El suscrito <strong>{form.doctorNombre}</strong>, {form.doctorTitulo}, con Cédula Profesional No.&nbsp;
                    <strong>{form.doctorCedula}</strong> expedida por la {form.doctorUniversidad}, certifica haber valorado
                    al(la) paciente <strong>{form.pacienteNombre || '____________________________'}</strong>, de&nbsp;
                    <strong>{form.pacienteEdad ? `${form.pacienteEdad} años` : '____ años'}</strong> de edad, habiendo encontrado lo siguiente:
                  </p>

                  {/* ─── PADECIMIENTO ─── */}
                  <div className="cert-section" style={{ marginBottom: '4mm' }}>
                    <span style={secHead}>I. Padecimiento Actual</span>
                    <p className="cert-text-expand"
                      style={{ fontSize: '9pt', color: '#374151', textAlign: 'justify', lineHeight: 1.65, paddingLeft: '5mm', margin: 0 }}>
                      {form.padecimientoActual}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #F0F0F0', margin: '3mm 0' }} />

                  {/* ─── EXPLORACIÓN ─── */}
                  <div className="cert-section" style={{ marginBottom: '4mm' }}>
                    <span style={secHead}>II. Exploración Física</span>
                    <p className="cert-text-expand"
                      style={{ fontSize: '9pt', color: '#374151', textAlign: 'justify', lineHeight: 1.65, paddingLeft: '5mm', margin: 0 }}>
                      {form.exploracionFisica}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #F0F0F0', margin: '3mm 0' }} />

                  {/* ─── DIAGNÓSTICO ─── */}
                  <div className="cert-section" style={{ marginBottom: '4mm' }}>
                    <span style={secHead}>III. Diagnóstico</span>
                    <div className="cert-text-expand" style={{
                      background: SOFT,
                      borderLeft: `4px solid ${NAVY}`,
                      borderRadius: '0 4px 4px 0',
                      padding: '3mm 5mm',
                      fontSize: '10pt',
                      fontWeight: 600,
                      color: NAVY,
                      lineHeight: 1.6,
                    }}>
                      {form.diagnostico}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #F0F0F0', margin: '3mm 0' }} />

                  {/* ─── RECOMENDACIONES ─── */}
                  <div className="cert-section" style={{ marginBottom: '6mm' }}>
                    <span style={secHead}>IV. Recomendaciones</span>
                    <p className="cert-text-expand"
                      style={{ fontSize: '9pt', color: '#374151', textAlign: 'justify', lineHeight: 1.65, paddingLeft: '5mm', margin: 0 }}>
                      {form.recomendaciones}
                    </p>
                  </div>

                  {/* ─── LEGAL CLOSING ─── */}
                  <p style={{ fontSize: '8.5pt', color: '#9CA3AF', textAlign: 'justify', lineHeight: 1.5, marginBottom: '7mm' }}>
                    El presente certificado se expide en Monterrey, N.L., a solicitud del interesado,
                    para los usos y efectos legales que le sean convenientes.
                  </p>

                  {/* ─── FOOTER: FIRMA + SELLO ─── */}
                  <div className="cert-section" style={{
                    borderTop: `2px solid ${NAVY}`,
                    paddingTop: '6mm',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'flex-end',
                    gap: '8mm',
                  }}>

                    {/* Firma block */}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <img src={firma} alt="Firma del médico"
                        style={{ height: '72px', objectFit: 'contain', display: 'block', margin: '0 auto 1mm' }} />
                      <div style={{ borderTop: '1px solid #374151', width: '200px', margin: '0 auto 2mm' }} />
                      <div style={{ fontFamily: 'DancingScript, cursive', fontSize: '14pt', color: NAVY, fontWeight: 700 }}>
                        {form.doctorNombre}
                      </div>
                      <div style={{ fontSize: '8pt', color: '#374151', marginTop: '1mm' }}>{form.doctorTitulo}</div>
                      <div style={{ fontSize: '8pt', color: '#6B7280' }}>{form.doctorEspecialidad}</div>
                      <div style={{ fontSize: '8pt', color: '#6B7280' }}>Cédula Prof. {form.doctorCedula}</div>
                    </div>

                    {/* Sello */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <img src={sello} alt="Sello del médico"
                        style={{ height: '170px', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                    </div>

                  </div>

                  {/* BOTTOM ACCENT */}
                  <div style={{ height: '5px', background: `linear-gradient(90deg, ${GOLD} 0%, ${NAVY} 100%)`, marginTop: '6mm' }} />

                </div>{/* /content padding */}
              </Paper>
            </div>
          </Grid>

        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default CertificadoMedico;
