// src/utils/input.ts
export function formatDateQuery(v: string) {
  const onlyDigits = v.replace(/\D/g, '').slice(0, 8);      // até 8 dígitos
  return onlyDigits
    .replace(/^(\d{2})(\d)/, '$1/$2')                       // dd/
    .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2');               // dd/mm/
}
