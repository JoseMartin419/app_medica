import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/pacientes/';

export const obtenerPacientes = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export async function crearPaciente(paciente) {
  const response = await axios.post('http://localhost:8000/api/pacientes/', paciente);
  return response.data;
}


export const crearConsulta = async (datos) => {
  const response = await axios.post('http://localhost:8000/api/consultas/', datos);
  return response.data;
};



export const obtenerHistorialPorPaciente = async (id) => {
  const response = await axios.get(`http://localhost:8000/api/consultas/paciente/${id}/`);
  return response.data;
};


