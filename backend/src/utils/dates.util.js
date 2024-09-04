export const addXDays = (startDate,days) => {
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
}

export const addXMinutes = (startDate,minutes) => {
  const result = new Date(startDate);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}