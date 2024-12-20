export const roundToNearest30Minutes = (date: Date): Date => {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 30) * 30;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    roundedMinutes,
    0,
    0,
  );
};

export function getDifferenceInDays(date1: Date, date2: Date) {
  // Convert input dates to Date objects if they are not already
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Calculate the difference in time (milliseconds)
  const differenceInTime = Math.abs(d2 - d1);

  // Convert the difference to days
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
  const differenceInHours = differenceInTime / (1000 * 60 * 60);

  return { differenceInDays, differenceInHours };
}
