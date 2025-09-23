import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { obtenerPacientes, crearConsulta, obtenerHistorialPorPaciente } from "../api/pacientes";
import { Decimal } from "decimal.js";
import { ChevronLeft, Stethoscope } from "lucide-react";
import Navbar from "../components/Navbar";

// 📌 Data
import medicamentos from "../data/medicamentos";
import { reglasPosologia } from "../data/posologias";

// 📌 Componentes refactorizados
import SignosVitalesForm from "../components/Consultas/SignosVitalesForm";
import ConsultaInfoForm from "../components/Consultas/ConsultaInfoForm";
import TratamientoForm from "../components/Consultas/TratamientoForm";
import PacienteCard from "../components/Consultas/PacienteCard";
import ExpedienteModal from "../components/Consultas/ExpedienteModal";
import SuccessNotification from "../components/Consultas/SuccessNotification";

export default function Consultas() {
  const [, setPacientes] = useState([]);
  const [pacienteActual, setPacienteActual] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [mostrarExpediente, setMostrarExpediente] = useState(false);

  const [consulta, setConsulta] = useState({
    paciente: "",
    motivo: "",
    antecedentes: "",
    peso: "",
    talla: "",
    imc: "",
    frecuencia_cardiaca: "",
    frecuencia_respiratoria: "",
    presion_arterial: "",
    glucometria: "",
    oximetria: "",
    temperatura: "",
    diagnostico: "",
    tratamiento: [],
    medico: "",
    notas: "",
  });

  const [medicamentoActual, setMedicamentoActual] = useState({
    nombre: "",
    posologia: "",
    duracion: "",
  });

  const [sugerencias, setSugerencias] = useState([]);
  const [busquedaMedFrecuente, setBusquedaMedFrecuente] = useState("");
  const [sugerenciasFrecuentes, setSugerenciasFrecuentes] = useState([]);
  const [activeTab, setActiveTab] = useState("signos");
  const [showSuccess, setShowSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const pacienteId = params.get("paciente");

  // ----------------- 📌 Funciones de ayuda -----------------
  const buscarMedicamentosFrecuentes = async (query) => {
    if (!query.trim()) {
      setSugerenciasFrecuentes([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/medicamentos-frecuentes/?search=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const resultados = await response.json();
        setSugerenciasFrecuentes(resultados);
      }
    } catch (error) {
      console.error("Error al buscar medicamentos frecuentes:", error);
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

  const fueraDeRango = (campo, valor) => {
    if (!valor) return false;
    const numValor = parseFloat(valor);
    if (isNaN(numValor)) return false;

    if (campo === "presion_arterial") {
      const partes = valor.split("/");
      if (partes.length !== 2) return true;
      const sistolica = parseFloat(partes[0]);
      const diastolica = parseFloat(partes[1]);
      return (
        sistolica < 90 ||
        sistolica > 120 ||
        diastolica < 60 ||
        diastolica > 80
      );
    }

    const rangos = {
      frecuencia_cardiaca: { min: 60, max: 100 },
      frecuencia_respiratoria: { min: 12, max: 20 },
      glucometria: { min: 70, max: 140 },
      oximetria: { min: 95, max: 100 },
      temperatura: { min: 36.5, max: 37.5 },
      imc: { min: 18.5, max: 24.9 },
    };

    return numValor < rangos[campo]?.min || numValor > rangos[campo]?.max;
  };

  const interpretarIMC = (imc) => {
    if (!imc) return "";
    const valor = parseFloat(imc);
    if (valor < 18.5) return "Bajo peso";
    if (valor < 25) return "Normal";
    if (valor < 30) return "Sobrepeso";
    if (valor < 35) return "Obesidad grado I";
    if (valor < 40) return "Obesidad grado II";
    return "Obesidad grado III";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nuevaConsulta = { ...consulta, [name]: value };

    if (name === "peso" || name === "talla") {
      const peso = name === "peso" ? parseFloat(value) : parseFloat(nuevaConsulta.peso);
      const tallaCm = name === "talla" ? parseFloat(value) : parseFloat(nuevaConsulta.talla);

      if (peso > 0 && tallaCm > 0) {
        const tallaM = tallaCm / 100;
        const imc = (peso / (tallaM * tallaM)).toFixed(2);
        nuevaConsulta.imc = imc;
      }
    }

    if (name === "presion_arterial") {
      const cleaned = value.replace(/[^0-9]/g, "");
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
      setConsulta((prev) => ({
        ...prev,
        tratamiento: [...(prev.tratamiento || []), medicamentoActual],
      }));
      setMedicamentoActual({ nombre: "", posologia: "", duracion: "" });
    }
  };

  const removerMedicamento = (index) => {
    setConsulta((prev) => ({
      ...prev,
      tratamiento: prev.tratamiento.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const decimalOrNull = (val) => {
      try {
        if (!val || isNaN(val)) return null;
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
      temperatura: decimalOrNull(consulta.temperatura),
    };

    if (!consultaLimpia.paciente) {
      alert("No se ha asignado el paciente.");
      return;
    }

    try {
      const consultaGuardada = await crearConsulta({
        ...consultaLimpia,
        paciente_id: consultaLimpia.paciente,
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      if (consultaGuardada.url_receta) {
        window.open(`http://localhost:8000${consultaGuardada.url_receta}`, "_blank");
      }

      setConsulta({
        ...consulta,
        motivo: "",
        antecedentes: "",
        peso: "",
        talla: "",
        imc: "",
        frecuencia_cardiaca: "",
        frecuencia_respiratoria: "",
        presion_arterial: "",
        glucometria: "",
        oximetria: "",
        temperatura: "",
        diagnostico: "",
        tratamiento: [],
        medico: "",
        notas: "",
      });
    } catch (error) {
      console.error("Error al registrar consulta:", error);
    }
  };

  // ----------------- 📌 useEffect -----------------
  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const data = await obtenerPacientes();
        setPacientes(data);

        if (pacienteId) {
          const encontrado = data.find((p) => p.id === parseInt(pacienteId));
          if (encontrado) {
            setPacienteActual(encontrado);
            setConsulta((prev) => ({
              ...prev,
              paciente: encontrado.id,
              antecedentes: encontrado.antecedentes || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      }
    };

    cargarPacientes();
  }, [pacienteId]);

  useEffect(() => {
    if (medicamentoActual.nombre.length > 0) {
      const texto = medicamentoActual.nombre.toLowerCase();
      const sugeridas = medicamentos
        .filter((m) => m.label.toLowerCase().includes(texto))
        .slice(0, 5);
      setSugerencias(sugeridas);
    } else {
      setSugerencias([]);
    }
  }, [medicamentoActual.nombre, consulta.peso]);

  // ----------------- 📌 Render Tabs -----------------
  const renderTabContent = () => {
    switch (activeTab) {
      case "signos":
        return (
          <SignosVitalesForm
            consulta={consulta}
            handleChange={handleChange}
            fueraDeRango={fueraDeRango}
            interpretarIMC={interpretarIMC}
          />
        );
      case "consulta":
        return (
          <ConsultaInfoForm
            consulta={consulta}
            handleChange={handleChange}
            setConsulta={setConsulta}
          />
        );
      case "tratamiento":
        return (
          <TratamientoForm
            consulta={consulta}
            setConsulta={setConsulta}
            medicamentoActual={medicamentoActual}
            setMedicamentoActual={setMedicamentoActual}
            sugerencias={sugerencias}
            setSugerencias={setSugerencias}
            busquedaMedFrecuente={busquedaMedFrecuente}
            setBusquedaMedFrecuente={setBusquedaMedFrecuente}
            sugerenciasFrecuentes={sugerenciasFrecuentes}
            buscarMedicamentosFrecuentes={buscarMedicamentosFrecuentes}
            agregarMedicamento={agregarMedicamento}
            removerMedicamento={removerMedicamento}
            pacienteActual={pacienteActual}
            reglasPosologia={reglasPosologia}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      <Navbar />

      <section className="pt-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={20} /> Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Stethoscope className="text-blue-600" size={28} />
            Nueva Consulta
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Tarjeta paciente */}
        <PacienteCard
          pacienteActual={pacienteActual}
          cargarHistorial={cargarHistorial}
          setMostrarExpediente={setMostrarExpediente}
        />

        {/* Formulario principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Pestañas */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("signos")}
                className={`py-4 px-6 border-b-2 ${
                  activeTab === "signos"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Signos Vitales
              </button>
              <button
                onClick={() => setActiveTab("consulta")}
                className={`py-4 px-6 border-b-2 ${
                  activeTab === "consulta"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Información Clínica
              </button>
              <button
                onClick={() => setActiveTab("tratamiento")}
                className={`py-4 px-6 border-b-2 ${
                  activeTab === "tratamiento"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Tratamiento
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {renderTabContent()}

            {/* Navegación entre pestañas */}
            <div className="mt-8 flex justify-between">
              {activeTab !== "signos" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === "tratamiento" ? "consulta" : "signos")
                  }
                  className="px-4 py-2 border rounded-md text-gray-700 bg-white"
                >
                  Anterior
                </button>
              )}
              {activeTab === "signos" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("consulta")}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Siguiente
                </button>
              )}
              {activeTab === "consulta" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("tratamiento")}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Siguiente
                </button>
              )}
              {activeTab === "tratamiento" && (
                <button
                  type="submit"
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md"
                >
                  Guardar Consulta
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Modal Expediente */}
      <ExpedienteModal
        mostrar={mostrarExpediente}
        setMostrar={setMostrarExpediente}
        pacienteActual={pacienteActual}
        historial={historial}
      />

      {/* Notificación éxito */}
      <SuccessNotification show={showSuccess} setShow={setShowSuccess} />
    </div>
  );
}
