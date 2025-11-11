export function normalizeTime(time: string | null | undefined): string {
  if (!time) return '00:00';
  const [hh = '00', mm = '00'] = time.split(':');
  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`;
}

export function formatEventDatePt(date?: string | null, time?: string | null): string {
  if (!date) return 'Data/hora indisponível';
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = normalizeTime(time).split(':').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0);
  if (Number.isNaN(dt.getTime())) return 'Data/hora indisponível';

  const datePart = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(dt);
  const timePart = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit'
  }).format(dt);
  return `${datePart} às ${timePart}`;
}

export function toDDMMYYYY(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '';
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
}

/** Ex.: query "10", "10/02", "10/02/2025" */
export function matchesDateQuery(iso: string, query: string): boolean {
  if (!query) return true;
  const formatted = toDDMMYYYY(iso);
  return formatted.includes(query.trim());
}

export function datePtToIso(d: string): string {
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) throw new Error('Data inválida (use dd/mm/aaaa)');
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

/** "HH:mm" ou "HHmm" -> "HH:mm:ss" */
export function timeToBackend(t: string): string {
  let hh = '', mm = '';
  if (/^\d{2}:\d{2}$/.test(t)) [hh, mm] = t.split(':');
  else if (/^\d{4}$/.test(t)) { hh = t.slice(0,2); mm = t.slice(2,4); }
  else throw new Error('Hora inválida (use HH:mm)');
  return `${hh.padStart(2,'0')}:${mm.padStart(2,'0')}:00`;
}

/** máscara leve "dd/mm/aaaa" aceita parcial */
export function maskDate(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2');
}

/** máscara leve "HH:mm" */
export function maskTime(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.replace(/^(\d{2})(\d)/, '$1:$2');
}
