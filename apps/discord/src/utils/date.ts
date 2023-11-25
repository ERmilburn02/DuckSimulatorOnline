const isDateOlderThanDays = (dateToCheck: Date, days: number) => {
  const now = new Date();
  const prev = new Date(now);
  prev.setDate(now.getDate() - days);

  return dateToCheck < prev;
};

export { isDateOlderThanDays };
