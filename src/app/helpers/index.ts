export function secondsToHhMm(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function workingHours(startDate: Date, leaveDays: number) {
  const startDateForLoop = new Date(startDate.getTime());
  const today = new Date();
  let days = 0;
  for (
    let date = startDateForLoop;
    date <= today;
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      days++;
    }
  }
  return days * 8 - leaveDays * 8;
}
