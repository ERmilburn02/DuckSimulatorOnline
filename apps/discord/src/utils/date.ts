const isDateOlderThanDays = (
  dateToCheck: Date,
  days: number,
  now: Date = new Date()
) => {
  const prev = new Date(now);
  prev.setDate(now.getDate() - days);

  return dateToCheck < prev;
};

const isDateOlderThanSeconds = (
  dateToCheck: Date,
  seconds: number,
  now: Date = new Date()
) => {
  const milliseconds = seconds * 1000; // Convert seconds to milliseconds
  const past = new Date(now.getTime() - milliseconds); // Subtract milliseconds from current time

  return dateToCheck < past;
};

export { isDateOlderThanDays, isDateOlderThanSeconds };
