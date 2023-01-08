export function getDateFromString(date: string): Date {
  return new Date(Date.parse(date));
}

export function dateToString(date: Date): string {
  return `${date.getFullYear()}-${formatItemDate(
    date.getMonth() + 1
  )}-${formatItemDate(date.getDate())}`;
}

export function formatItemDate(number: number): string {
  return number < 10 ? `0${number}` : number.toString();
}
