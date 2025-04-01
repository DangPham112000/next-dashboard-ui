export const getCurrentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const startOfWeek = new Date();

  if (dayOfWeek === 0) {
    startOfWeek.setDate(today.getDate() + 1);
  } else if (dayOfWeek === 6) {
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};
