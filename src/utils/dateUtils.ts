// src/utils/dateUtils.ts

export function getLastMonths(count: number = 24) {
    const months = [];
    const currentDate = new Date();
  
    for (let i = 0; i < count; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('es', { month: 'long', year: 'numeric' })
      });
    }
    return months;
  }
  
  export function getAvailableYears(count: number = 5) {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < count; i++) {
      years.push(currentYear - i);
    }
    return years;
  }
  