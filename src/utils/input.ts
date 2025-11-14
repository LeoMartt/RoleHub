export function formatDateQuery(v: string) {
  const onlyDigits = v.replace(/\D/g, '').slice(0, 8);      
  return onlyDigits
    .replace(/^(\d{2})(\d)/, '$1/$2')                      
    .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2');               
}
