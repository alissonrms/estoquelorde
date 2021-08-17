export function daysInMonth (month, year) {
  return new Date(year, month, 0).getDate();
}

export function getFirstAndLastDayOfCurrentMonth() {
  const currentDate = new Date();
  const firstDay = new Date(currentDate.getFullYear(),
    currentDate.getMonth(), 1);

  const lastDay = new Date(currentDate.getFullYear(),
    currentDate.getMonth(), daysInMonth(currentDate.getMonth() + 1,
      currentDate.getFullYear())
  );

  return ({ firstDay, lastDay });
}

export function convertNumberToBrlCurrency(number){
  return (Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(number));
}

