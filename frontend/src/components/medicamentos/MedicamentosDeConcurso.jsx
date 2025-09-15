import React, { useState } from 'react';

const medicamentosConcurso = [
  {
    "nombre": "Magaldrato/Dimet 250ml",
    "uso": "Antiácido, para el alivio de la acidez estomacal y la indigestión"
  },
  {
    "nombre": "Omeprazol/Bicar Sod 20/1100mg 30cap",
    "uso": "Inhibidor de la bomba de protones, para el reflujo gastroesofágico y úlceras"
  },
  {
    "nombre": "Subsal Bismuto Pepto Bismol Plus 118ml",
    "uso": "Antidiarreico, para el alivio de la diarrea, náuseas, indigestión y malestar estomacal"
  },
  {
    "nombre": "Sal de Uvas Picot 10+2 Sob Polvo Efer",
    "uso": "Antiácido efervescente, para el alivio rápido de la acidez y la indigestión"
  },
  {
    "nombre": "Subsalicilato de Bismuto 24tab Mast",
    "uso": "Antidiarreico, para el alivio de la diarrea, náuseas, indigestión y malestar estomacal"
  },
  {
    "nombre": "Subsal Bismuto Pepto Bismol 4tab Mast",
    "uso": "Antidiarreico, para el alivio de la diarrea, náuseas, indigestión y malestar estomacal"
  },
  {
    "nombre": "Subsalicilato de Bismuto 120ml",
    "uso": "Antidiarreico, para el alivio de la diarrea, náuseas, indigestión y malestar estomacal"
  },
  {
    "nombre": "Magaldrato/Dimet 10sob",
    "uso": "Antiácido, para el alivio de la acidez estomacal y la indigestión"
  },
  {
    "nombre": "Magaldrato/Dimet 80mg/10mg 10sob Takeda",
    "uso": "Antiácido, para el alivio de la acidez estomacal y la indigestión"
  },
  {
    "nombre": "Magaldrato/Dimet 8g/1g/100ml Takeda",
    "uso": "Antiácido, para el alivio de la acidez estomacal y la indigestión"
  },
  {
    "nombre": "Neomicina/Caoli/Pectin 20tab",
    "uso": "Antidiarreico y antibiótico, para el tratamiento de diarreas bacterianas"
  },
  {
    "nombre": "Neomicina/Caoli/Pectin Susp 75ml",
    "uso": "Antidiarreico y antibiótico, para el tratamiento de diarreas bacterianas"
  },
  {
    "nombre": "Neomicina/Caoli/Pectin 180ml Susp",
    "uso": "Antidiarreico y antibiótico, para el tratamiento de diarreas bacterianas"
  },
  {
    "nombre": "Loxcell Quinf/Albend 300/400mg 1tab",
    "uso": "Antihelmíntico, para el tratamiento de infecciones parasitarias intestinales"
  },
  {
    "nombre": "Loxcell Quinf/Albend 100/200mg Susp 10ml",
    "uso": "Antihelmíntico, para el tratamiento de infecciones parasitarias intestinales"
  },
  {
    "nombre": "Loxcell Quinf/Albend 200/400mg Susp 20ml",
    "uso": "Antihelmíntico, para el tratamiento de infecciones parasitarias intestinales"
  },
  {
    "nombre": "Quinfamida/Albend 150/200mg 2tab",
    "uso": "Antihelmíntico, para el tratamiento de infecciones parasitarias intestinales"
  },
  {
    "nombre": "Quinfamida/Albend 200/400mg 2ml Jr",
    "uso": "Antihelmíntico, para el tratamiento de infecciones parasitarias intestinales"
  },
  {
    "nombre": "Quinfamida/Albend 100/200mg 1ml Ped",
    "uso": "Antihelmíntico, para el tratamiento de infecciones parasitarias intestinales en niños"
  },
  {
    "nombre": "Pinaverio/Dimeticona 100/300mg 16cap",
    "uso": "Antiespasmódico, para el alivio de espasmos intestinales y gases"
  },
  {
    "nombre": "Lactob Forte 100cap Simibacilos",
    "uso": "Probiótico, para restaurar la flora intestinal y mejorar la salud digestiva"
  },
  {
    "nombre": "Probióticos 6 Lactobacilos 60sobres",
    "uso": "Probiótico, para restaurar la flora intestinal y mejorar la salud digestiva"
  },
  {
    "nombre": "Lactob Forte 30cap Simibacilos",
    "uso": "Probiótico, para restaurar la flora intestinal y mejorar la salud digestiva"
  },
  {
    "nombre": "Lactobacillus Ped Fco Sol 6ml Bellybiot",
    "uso": "Probiótico pediátrico, para restaurar la flora intestinal en niños"
  },
  {
    "nombre": "Esporas Bac Claus 4bill 10amp Sinuberas",
    "uso": "Probiótico, para el equilibrio de la flora intestinal"
  },
  {
    "nombre": "Esporas Bac Claus 2bill 10amp Enteroger",
    "uso": "Probiótico, para el equilibrio de la flora intestinal"
  },
  {
    "nombre": "Esporas Bac Coagul 1mufc 48com Sinuberas",
    "uso": "Probiótico, para el equilibrio de la flora intestinal"
  },
  {
    "nombre": "Bloqueador 50+125gr Eternal Facial/Corp",
    "uso": "Protección solar, para proteger la piel de los rayos UV"
  },
  {
    "nombre": "Bloqueador 50+60gr Eternal Facial/Corp",
    "uso": "Protección solar, para proteger la piel de los rayos UV"
  },
  {
    "nombre": "Bloqueador Ecofriendly 50+ Eternal 125ml",
    "uso": "Protección solar amigable con el medio ambiente, para proteger la piel de los rayos UV"
  },
  {
    "nombre": "Gel Post Bronceado 250ml Aloe Vera",
    "uso": "Cuidado de la piel post-solar, para aliviar y refrescar la piel después de la exposición al sol"
  },
  {
    "nombre": "Bloqueador Ultra Max 100 125gr Simiblock",
    "uso": "Protección solar muy alta, para proteger la piel de los rayos UV"
  },
  {
    "nombre": "Bloqueador Fluido 50+ 50ml Eternal Secret",
    "uso": "Protección solar, para proteger la piel de los rayos UV"
  },
  {
    "nombre": "Bloqueador Aer FP55+ 70ml Eternal Bruma",
    "uso": "Protección solar en aerosol, para proteger la piel de los rayos UV"
  },
  {
    "nombre": "Bloqueador 50+ Spray Banana Boat 170gr",
    "uso": "Protección solar en spray, para proteger la piel de los rayos UV"
  },
  {
    "nombre": "Butilhioscina/Hioscina/Ibuprofeno 10tab",
    "uso": "Antiespasmódico y analgésico, para el alivio de cólicos y dolor"
  },
  {
    "nombre": "Butilhio(Hioscina) 10mg 12 Tab Buscapina",
    "uso": "Antiespasmódico, para el alivio de espasmos abdominales y cólicos"
  },
  {
    "nombre": "Electrolito Pvo 10sob Xgear Citrus",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Bebida 0% Azúcar Fresa Xgear 10tab EferV",
    "uso": "Reposición de electrolitos sin azúcar, para hidratación y recuperación de minerales"
  },
  {
    "nombre": "Electrolito Pvo 10sob Xgear Mango-Chile",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Enzimas Digestivas 60tab",
    "uso": "Mejora de la digestión, para ayudar a descomponer los alimentos y absorber nutrientes"
  },
  {
    "nombre": "Condón Alfa Texturizado Retard 3pzas",
    "uso": "Anticonceptivo y protección contra ETS, con textura para estimulación y efecto retardante"
  },
  {
    "nombre": "Gel Lubricante Vaginal 60gr Alfa Kinky",
    "uso": "Lubricante íntimo, para mejorar la comodidad durante la actividad sexual"
  },
  {
    "nombre": "Maca Alfa Abuzz 60cap",
    "uso": "Suplemento energético y para la líbido"
  },
  {
    "nombre": "Fragancia para Caballero Alfa 60ml",
    "uso": "Perfume, para uso personal"
  },
  {
    "nombre": "Condón Alfa Climax Ultrasen 2pzas",
    "uso": "Anticonceptivo y protección contra ETS, diseñado para mayor sensibilidad"
  },
  {
    "nombre": "Duramax Gel",
    "uso": "Gel para mejorar el rendimiento sexual"
  },
  {
    "nombre": "Succionador Íntimo Dama 1pza Alfa Kinky",
    "uso": "Juguete sexual, para estimulación íntima femenina"
  },
  {
    "nombre": "Condón Alfa Extr Climax Text 2pzas",
    "uso": "Anticonceptivo y protección contra ETS, con textura para estimulación"
  },
  {
    "nombre": "Mini Bala Vibra Dama/Caballero Alfa 1pza",
    "uso": "Juguete sexual, para estimulación personal"
  },
  {
    "nombre": "Anillo Vibrador Alfa 1pza",
    "uso": "Juguete sexual, para estimulación en pareja"
  },
  {
    "nombre": "Gel Lubricante Antisept Íntimo 25gr Alfa",
    "uso": "Lubricante íntimo con propiedades antisépticas"
  },
  {
    "nombre": "Creatina 5gr Polvo 500gr Xgear",
    "uso": "Suplemento deportivo, para aumentar la fuerza y el rendimiento muscular"
  },
  {
    "nombre": "Prot Xgear Zero Carb Chocolate 450gr",
    "uso": "Suplemento de proteína sin carbohidratos, para recuperación muscular y dieta"
  },
  {
    "nombre": "Repelente Insec(Deet 15%) 170gr Aerosol",
    "uso": "Repelente de insectos, para proteger contra picaduras de mosquitos y otros insectos"
  },
  {
    "nombre": "Repelente Insec(Deet 15%) 200ml Off",
    "uso": "Repelente de insectos, para proteger contra picaduras de mosquitos y otros insectos"
  },
  {
    "nombre": "Repelente Insec(Deet 15%) 177ml Spray Off",
    "uso": "Repelente de insectos, para proteger contra picaduras de mosquitos y otros insectos"
  },
  {
    "nombre": "Isotipen 0.75/100gr Jalea 25gr Andantol",
    "uso": "Tratamiento tópico, para el alivio de irritaciones cutáneas leves"
  },
  {
    "nombre": "Isotipen 0.75gr/100gr Jalea 25gr",
    "uso": "Tratamiento tópico, para el alivio de irritaciones cutáneas leves"
  },
  {
    "nombre": "Minoxidil 5gr/100ml Sol 60ml",
    "uso": "Tratamiento para la caída del cabello, para estimular el crecimiento capilar"
  },
  {
    "nombre": "Electrolito Oral Mza 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito Oral Coco 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito Oral Nja-Mdna 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito Oral Fresa 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito Oral Lima-Lim 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito Oral Fre-Kiwi 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito Oral Uva 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito 0% Azúcar Ponche 500ml",
    "uso": "Reposición de electrolitos sin azúcar, para hidratación y recuperación de minerales"
  },
  {
    "nombre": "Electrolito Oral Mora Azul 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito 0% Azú Uva 500ml Hidratasim",
    "uso": "Reposición de electrolitos sin azúcar, para hidratación y recuperación de minerales"
  },
  {
    "nombre": "Electrolito 0%Azú Fre-Kiw 500ml Hidratasim",
    "uso": "Reposición de electrolitos sin azúcar, para hidratación y recuperación de minerales"
  },
  {
    "nombre": "Electrolito Oral Jamaica 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Electrolito Prf Ubva 500ml",
    "uso": "Reposición de electrolitos, para prevenir la deshidratación y recuperar minerales"
  },
  {
    "nombre": "Hongo Melena Leon/Cordyceps/Reishi 150gr",
    "uso": "Suplemento natural, para el apoyo de funciones cognitivas, energía e inmunidad"
  }
];

export default function MedicamentosDeConcurso() {
  const [busquedaLocal, setBusquedaLocal] = useState(''); // Nuevo estado para la búsqueda local
  const [paginaActual, setPaginaActual] = useState(1);
  const medicamentosPorPagina = 10;

  // Función para quitar acentos
  const quitarAcentos = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Filtrar medicamentos basados en la búsqueda local
  const medicamentosFiltrados = medicamentosConcurso.filter(med => {
    const textoBusqueda = quitarAcentos(busquedaLocal.toLowerCase());
    const nombreSinAcentos = quitarAcentos(med.nombre.toLowerCase());
    const usoSinAcentos = quitarAcentos(med.uso.toLowerCase());
    return nombreSinAcentos.includes(textoBusqueda) || usoSinAcentos.includes(textoBusqueda);
  });

  const indiceInicial = (paginaActual - 1) * medicamentosPorPagina;
  const indiceFinal = indiceInicial + medicamentosPorPagina;
  const medicamentosPagina = medicamentosFiltrados.slice(indiceInicial, indiceFinal);

  const totalPaginas = Math.ceil(medicamentosFiltrados.length / medicamentosPorPagina);

  const irAPaginaAnterior = () => {
    setPaginaActual(prev => Math.max(prev - 1, 1));
  };

  const irAPaginaSiguiente = () => {
    setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  };

  // Función para resaltar texto (opcional, pero útil para la búsqueda)
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
    <div className="p-4 bg-white rounded shadow-md mt-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">🧠 Medicamentos de Concurso</h2>
      
      {/* Barra de búsqueda para Medicamentos de Concurso */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar medicamento de concurso..."
          value={busquedaLocal}
          onChange={(e) => {
            setBusquedaLocal(e.target.value);
            setPaginaActual(1); // Resetear a la primera página al buscar
          }}
          className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <ul className="space-y-2">
        {medicamentosPagina.length > 0 ? (
          medicamentosPagina.map((med, idx) => (
            <li key={idx} className="p-3 rounded-md bg-gray-50 hover:bg-blue-50 transition">
              <strong className="text-blue-700">{resaltar(med.nombre, busquedaLocal)}</strong>
              <div className="text-sm text-gray-600">{resaltar(med.uso, busquedaLocal)}</div>
            </li>
          ))
        ) : (
          <li className="p-3 text-center text-gray-500">
            No se encontraron medicamentos para esta búsqueda.
          </li>
        )}
      </ul>

      {/* Controles de paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={irAPaginaAnterior}
            disabled={paginaActual === 1}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-gray-700">
            Página {paginaActual} de {totalPaginas} ({medicamentosFiltrados.length} resultados)
          </span>
          <button
            onClick={irAPaginaSiguiente}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}