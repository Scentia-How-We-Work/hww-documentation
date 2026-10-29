/** A YYYY-MM-DD date as DD/MM/YYYY, the Australian format the pages use. */
export function formatDate(date: string): string {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : date;
}
