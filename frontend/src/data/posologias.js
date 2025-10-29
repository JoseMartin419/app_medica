export const reglasPosologia = {

  // AMANTADINA + CLORFENAMINA + PARACETAMOL
  'Amantadina + Clorfenamina + Paracetamol 0.02g/3g/100ml': {
  texto: (peso) => {
    const tomasDia = 3; // cada 8 horas
    // Usamos Paracetamol como base: 10–15 mg/kg/dosis
    const dosisParacetamolMgKg = 12.5; 
    const concentracionParacetamol = 30; // 30 mg/mL (3g/100mL)
    const dosisPorTomaMg = peso * dosisParacetamolMgKg;
    const mlPorToma = (dosisPorTomaMg / concentracionParacetamol).toFixed(1);
    return `Tomar ${mlPorToma} mL cada 8 horas por 5 días`;
  }
},

  'Ambroxol 300mg/100ml Solución': {
  texto: (peso) => {
    const dosisMgKgDia = 1.5; // mg/kg/día
    const tomasDia = 2;       // cada 12 horas
    const mgPorMl = 3;        // 300mg/100mL = 3mg/mL

    // Paso 1: calcular dosis diaria total en mg
    const mgDia = peso * dosisMgKgDia;

    // Paso 2: convertir mg → mL
    const mlDia = mgDia / mgPorMl;

    // Paso 3: dividir entre las tomas diarias
    const mlPorToma = (mlDia / tomasDia).toFixed(1);

    return `Tomar ${mlPorToma} mL cada 8 horas por 7 días`;
  }
},


  // PARACETAMOL
  'Paracetamol 3.2g/100ml Suspensión 120ml': {
    texto: (peso) => {
      const dosisMg = peso * 15; // 15 mg/kg/dosis
      const mgPorMl = 32; // 3.2g/100ml = 32mg/ml
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 8 horas por 5 días`;
    }
  },

  // AMOXICILINA / ÁCIDO CLAVULÁNICO
  'Amoxicilina/Ac. Clavulánico 125/5ml Suspensión': {
  texto: (peso) => {
    const dosisMgKgDia = 35; // posología: 35 mg/kg/día
    const mgPor5ml = 125;    // concentración: 125 mg por 5 mL
    const tomasDia = 3;      // cada 8 horas (3 veces al día)

    // Paso 1: calcular mg totales por día (peso × dosis)
    const mgDia = peso * dosisMgKgDia;
    // Paso 2: regla de tres para convertir mg → mL (mgDia × 5 / 125)
    const mlDia = (mgDia * 5) / mgPor5ml;
    // Paso 3: dividir entre las tomas diarias (por ejemplo, 3 tomas al día)
    const mlPorToma = (mlDia / tomasDia).toFixed(1);

    return `Tomar ${mlPorToma} mL cada 8 horas por 7 días`;
  }
},


  'Amoxicilina/Ac. Clavulánico 200/5ml Suspensión': {
    texto: (peso) => {
      const dosisMg = peso * 45;
      const mgPorMl = 40;
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 8 horas por 7 días`;
    }
  },

  'Amoxicilina/Ac. Clavulánico 250/5ml Suspensión': {
  texto: (peso) => {
    const dosisMgKgDia = 35; // posología: 35 mg/kg/día
    const mgPor5ml = 250;    // concentración: 125 mg por 5 mL
    const tomasDia = 3;      // cada 8 horas (3 veces al día)

    // Paso 1: calcular mg totales por día (peso × dosis)
    const mgDia = peso * dosisMgKgDia;
    // Paso 2: regla de tres para convertir mg → mL (mgDia × 5 / 125)
    const mlDia = (mgDia * 5) / mgPor5ml;
    // Paso 3: dividir entre las tomas diarias (por ejemplo, 3 tomas al día)
    const mlPorToma = (mlDia / tomasDia).toFixed(1);
    
    return `Tomar ${mlPorToma} mL cada 8 horas por 7 días`;
  }
},

  'Amoxicilina/Ac. Clavulánico 400/5ml Suspensión': {
  texto: (peso) => {
    const dosisMgKgDia = 45; // posología: 45 mg/kg/día (infecciones moderadas a graves)
    const mgPor5ml = 400;    // concentración: 400 mg por cada 5 mL
    const tomasDia = 2;      // cada 12 horas (2 veces al día)

    // Paso 1: calcular mg totales por día
    const mgDia = peso * dosisMgKgDia;

    // Paso 2: regla de tres para convertir mg → mL
    // (mgDia × 5) / 400 = mL totales al día
    const mlDia = (mgDia * 5) / mgPor5ml;

    // Paso 3: dividir entre las tomas diarias
    const mlPorToma = (mlDia / tomasDia).toFixed(1);

    return `Tomar ${mlPorToma} mL cada 12 horas por 7 días`;
  }
},


  'Amoxicilina/Ac. Clavulánico 600/5ml Suspensión': {
  texto: (peso) => {
    const dosisMgKgDia = 45; // posología: 45 mg/kg/día de amoxicilina (infección moderada a grave)
    const mgPor5ml = 600;    // concentración: 600 mg en 5 mL
    const tomasDia = 2;      // cada 12 horas (2 veces al día)

    // Paso 1: calcular mg totales por día (peso × dosis)
    const mgDia = peso * dosisMgKgDia;

    // Paso 2: aplicar regla de tres para convertir mg → mL
    // (mgDia × 5) / 600 = mL totales del día
    const mlDia = (mgDia * 5) / mgPor5ml;

    // Paso 3: dividir entre las tomas diarias (2 tomas al día)
    const mlPorToma = (mlDia / tomasDia).toFixed(1);

    return `Tomar ${mlPorToma} mL cada 12 horas por 7 días`;
  }
},


  // IBUPROFENO
  'Ibuprofeno 2g/100ml Suspensión 120ml': {
    texto: (peso) => {
      const dosisMg = peso * 10; 
      const mgPorMl = 20; 
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 8 horas por 3 a 5 días`;
    }
  },

  // METAMIZOL
  'Metamizol Sódico 250mg/5ml Jarabe 100ml': {
    texto: (peso) => {
      const dosisMg = peso * 15; 
      const mgPorMl = 50; 
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 6-8 horas según dolor o fiebre`;
    }
  },



  'Ambroxol 7.5mg/1ml Solución': {
    texto: (peso) => {
      const dosisMg = peso * 1.2; 
      const mgPorMl = 7.5; 
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 12 horas por 5 días`;
    }
  },

  'Ambroxol 750mg/100ml Jarabe': {
    texto: (peso) => {
      const dosisMg = peso * 1.2;
      const mgPorMl = 7.5; 
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 12 horas por 5 días`;
    }
  },

  // AMBROXOL COMBINADOS
  'Ambroxol + Clenbuterol 0.01mg/100ml': {
    texto: () => {
      return `Tomar 5 ml cada 12 horas por 5 días. Ajustar según respuesta bronquial.`;
    }
  },

  'Ambroxol + Levodropropizina 600mg/100ml': {
    texto: () => {
      return `Tomar 5 ml cada 8 horas por 5 días. No combinar con antitusígenos centrales.`;
    }
  },

  'Ambroxol + Loratadina 100mg/100ml': {
    texto: () => {
      return `Tomar 5 ml cada 12 horas por 5 días para tos alérgica o con flema leve.`;
    }
  },

  // CETIRIZINA
  'Cetirizina 1mg/ml Gotas': {
    texto: (peso) => {
      const dosisMg = peso * 0.25; // 0.25 mg/kg/día
      const mgPorMl = 1;
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml una vez al día por 5 a 7 días`;
    }
  },

  // DESLORATADINA
  'Desloratadina 0.5mg/ml Solución': {
    texto: (peso) => {
      const dosisMg = peso * 0.1; 
      const mgPorMl = 0.5;
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml una vez al día por 5 días`;
    }
  },

  // SALBUTAMOL
  'Salbutamol 2mg/5ml Jarabe': {
    texto: (peso) => {
      const dosisMg = peso * 0.1; // 0.1-0.15 mg/kg/dosis
      const mgPorMl = 0.4; // 2mg en 5ml = 0.4 mg/ml
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 8 horas mientras dure la broncoconstricción`;
    }
  },
  'Ceftriaxona 500mg/2ml Ampolleta': {
  texto: (peso) => {
    const dosisMgKgDia = 50; // dosis habitual: 50 mg/kg/día
    const mgPorMl = 250;     // 500 mg / 2 mL = 250 mg/mL
    const tomasDia = 1;      // una dosis diaria

    // Paso 1: calcular mg totales por día
    const mgDia = peso * dosisMgKgDia;

    // Paso 2: convertir mg → mL
    const mlPorToma = (mgDia / mgPorMl).toFixed(1);

    return `Aplicar ${mlPorToma} mL intramuscular cada 24 horas por 3 días`;
  }
},
'Ceftriaxona 1g/3.5ml Ampolleta (Adultos)': {
  texto: (peso) => {
    const dosisMgDia = 1000;   // 1 g = 1000 mg (dosis habitual)
    const mgPorMl = 285.7;     // 1g / 3.5mL = 285.7 mg/mL
    const tomasDia = 1;        // una dosis cada 24 horas

    // Paso 1: convertir mg → mL
    const mlPorToma = (dosisMgDia / mgPorMl).toFixed(1);

    return `Aplicar ${mlPorToma} mL intramuscular por 3 días`;
  }
},


};

export default reglasPosologia;
