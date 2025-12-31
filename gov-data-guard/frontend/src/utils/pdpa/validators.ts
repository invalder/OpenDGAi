/**
 * Validates a Thai National ID using the checksum algorithm.
 * @param id The 13-digit ID string.
 * @returns true if valid, false otherwise.
 */
export const validateThaiNationalID = (id: string): boolean => {
  if (!/^\d{13}$/.test(id)) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id[i]) * (13 - i);
  }

  const checksum = (11 - (sum % 11)) % 10;
  return checksum === parseInt(id[12]);
};

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Thai phone numbers: +66, 0xx-xxx-xxxx, 02-xxx-xxxx, etc.
// Simplified regex for common formats.
export const phoneRegex = /^(0\d{1,2}-?\d{3,4}-?\d{3,4}|\+66\d{9})$/;

// Basic check for Thai characters or common address keywords
export const addressRegex = /[\u0E00-\u0E7F]+|(District|Sub-district|Province|Road|Soi|Moo)/i;
