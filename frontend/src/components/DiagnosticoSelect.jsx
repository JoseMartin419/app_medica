import AsyncSelect from 'react-select/async';
import axios from 'axios';

const DiagnosticoSelect = ({ value, onChange }) => {
  const cargarOpciones = async (inputValue) => {
    if (!inputValue) return [];
    const res = await axios.get('http://localhost:8000/api/diagnosticos/', {
      params: { search: inputValue }
    });
    return res.data.map((d) => ({
      label: `${d.codigo} - ${d.descripcion}`,
      value: `${d.codigo} - ${d.descripcion}`
    }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Diagnóstico (CIE10)
      </label>
      <AsyncSelect
        cacheOptions
        defaultOptions={false}
        loadOptions={cargarOpciones}
        onChange={(opcion) => onChange(opcion?.value || "")}
        value={value ? { label: value, value } : null}
        placeholder="Buscar diagnóstico..."
        isClearable
      />
    </div>
  );
};

export default DiagnosticoSelect;
