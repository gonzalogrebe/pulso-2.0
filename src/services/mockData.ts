'use client';

// Función para generar un número pseudo-aleatorio determinista
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Función para generar variación con tendencia más pronunciada
const generateVariation = (baseAmount: number, month: number, year: number) => {
  const seed = year * 12 + month;

  // Factores de variación más pronunciados
  const seasonalFactor = 1 + Math.sin(month * Math.PI / 6) * 0.25; // ±25% variación estacional
  const trendFactor = 1 + (month / 12) * 0.15; // Tendencia creciente hasta 15%
  const randomFactor = 1 + (seededRandom(seed) * 0.2 - 0.1); // ±10% variación aleatoria

  return Math.round(baseAmount * seasonalFactor * trendFactor * randomFactor);
};

// Base expenses con montos más variados
const baseExpenses2024 = {
  materials: 300000,
  labor: 200000,
  equipment: 150000,
  overhead: 100000
};

// Función para generar datos mensuales para un año con más variación
const generateYearlyData = (year: number, baseTotal: number) => {
  return Array.from({ length: 12 }, (_, i) => {
    const month = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i];

    // Generar presupuesto con variación estacional
    const budgeted = generateVariation(baseTotal, i, year);

    // Generar real con más variación respecto al presupuesto
    const actualVariation = 1 + (seededRandom(year * month) * 0.4 - 0.2); // ±20% variación del presupuesto
    const actual = Math.round(budgeted * actualVariation);

    const result: any = {
      name: month,
      [`presupuestado_${year}`]: budgeted,
      [`real_${year}`]: actual,
    };

    // Añadir desglose solo para 2024 con variaciones más pronunciadas
    if (year === 2024) {
      result.materials = generateVariation(baseExpenses2024.materials, i, year + 2000);
      result.labor = generateVariation(baseExpenses2024.labor, i, year + 3000);
      result.equipment = generateVariation(baseExpenses2024.equipment, i, year + 4000);
      result.overhead = generateVariation(baseExpenses2024.overhead, i, year + 5000);
    }

    return result;
  });
};

// Generar datos para cada año con bases crecientes
const data = {
  2024: generateYearlyData(2024, 750000), // Base más alta para 2024
  2023: generateYearlyData(2023, 650000), // Base media para 2023
  2022: generateYearlyData(2022, 550000)  // Base más baja para 2022
};

// Función para combinar datos de diferentes años
export const getCombinedData = (years: number[]) => {
  return data[2024].map((monthData, index) => {
    const combinedMonth: any = { name: monthData.name };
    years.forEach(year => {
      if (data[year]) {
        Object.keys(data[year][index])
          .filter(key => key !== 'name')
          .forEach(key => {
            combinedMonth[key] = data[year][index][key];
          });
      }
    });
    return combinedMonth;
  });
};

// Alertas mock actualizadas con variaciones más significativas
export const getMockAlerts = () => [
  {
    id: 1,
    fecha: '2024-01-05',
    descripcion: 'Exceso significativo en gastos de materiales',
    categoria: 'Materiales',
    variacion: '+25.8%',
    severidad: 'alta',
    monto: 77500
  },
  {
    id: 2,
    fecha: '2024-01-04',
    descripcion: 'Retraso crítico en cronograma de obra',
    categoria: 'Cronograma',
    variacion: '12 días',
    severidad: 'alta',
    monto: 0
  },
  {
    id: 3,
    fecha: '2024-01-03',
    descripcion: 'Desviación importante en costos de mano de obra',
    categoria: 'Mano de Obra',
    variacion: '+18.3%',
    severidad: 'media',
    monto: 36600
  }
];

// Obtener datos de resumen con variaciones más significativas
export const getSummaryData = () => {
  const currentMonth = new Date().getMonth();
  const currentMonthData = data[2024][currentMonth];

  // Calcular variación con más precisión
  const variacion = ((currentMonthData[`real_2024`] - currentMonthData[`presupuestado_2024`])
    / currentMonthData[`presupuestado_2024`] * 100).toFixed(1);

  return {
    gastosTotales: currentMonthData[`real_2024`],
    variacionPresupuesto: variacion,
    tiempoRestante: '45 días',
    alertasActivas: getMockAlerts().length
  };
};