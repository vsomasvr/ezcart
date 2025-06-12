
// src/utils.ts

/**
 * Parses a RAM specification string to extract the RAM amount in GB.
 * Example: "32GB DDR5 4800MHz" -> 32
 * Example: "18GB Unified Memory" -> 18
 */
export const parseRamToGB = (ramSpec: string): number => {
  if (!ramSpec) return 0;
  const match = ramSpec.match(/(\d+)\s*GB/i);
  return match && match[1] ? parseInt(match[1], 10) : 0;
};

/**
 * Parses a storage specification string to extract the storage amount in GB.
 * Handles TB and GB units. Assumes 1TB = 1000GB for simplicity in filtering,
 * can be changed to 1024 if strict binary conversion is needed.
 * Example: "1TB PCIe Gen4 NVMe SSD" -> 1000
 * Example: "512GB SSD" -> 512
 * Example: "2TB (2x 1TB) PCIe Gen4 NVMe SSD RAID 0" -> 2000
 */
export const parseStorageToGB = (storageSpec: string): number => {
  if (!storageSpec) return 0;

  const tbMatch = storageSpec.match(/(\d+)\s*TB/i);
  if (tbMatch && tbMatch[1]) {
    return parseInt(tbMatch[1], 10) * 1024; // Using 1024 for TB to GB
  }

  const gbMatch = storageSpec.match(/(\d+)\s*GB/i);
  if (gbMatch && gbMatch[1]) {
    return parseInt(gbMatch[1], 10);
  }
  
  // Fallback for cases like "1TB" directly passed as filter value
  if (storageSpec.toUpperCase().endsWith('TB')) {
    const numericPart = parseFloat(storageSpec.toUpperCase().replace('TB', ''));
    if (!isNaN(numericPart)) return numericPart * 1024;
  }
  if (storageSpec.toUpperCase().endsWith('GB')) {
    const numericPart = parseFloat(storageSpec.toUpperCase().replace('GB', ''));
    if (!isNaN(numericPart)) return numericPart;
  }

  return 0;
};
