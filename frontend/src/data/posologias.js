export const reglasPosologia = {
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
      const dosisMg = peso * 45; // 45 mg/kg/día divididos en 2-3 dosis
      const mgPorMl = 25; 
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 8 horas por 7 días`;
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
      const dosisMg = peso * 45;
      const mgPorMl = 50;
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 8 horas por 7 días`;
    }
  },

  'Amoxicilina/Ac. Clavulánico 400/5ml Suspensión': {
    texto: (peso) => {
      const dosisMg = peso * 45;
      const mgPorMl = 80;
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 12 horas por 7 días`;
    }
  },

  'Amoxicilina/Ac. Clavulánico 600/5ml Suspensión': {
    texto: (peso) => {
      const dosisMg = peso * 45;
      const mgPorMl = 120;
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 12 horas por 7 días`;
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

  // AMBROXOL
  'Ambroxol 300mg/100ml Solución': {
    texto: (peso) => {
      const dosisMg = peso * 1.2; 
      const mgPorMl = 3; 
      const ml = (dosisMg / mgPorMl).toFixed(1);
      return `Tomar ${ml} ml cada 12 horas por 5 días`;
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
  }
};

export default reglasPosologia;
