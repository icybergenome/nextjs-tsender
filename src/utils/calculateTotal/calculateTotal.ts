// for reusability or for unit test we wrote this logic as a util

export function calculateTotal(amounts: string): number {
  const entries = amounts.split(/[\r\n,]+/); // Split on commas, newlines (and carriage returns)
  let total = 0;

  for (const entry of entries) {
    const trimmedEntry = entry.trim(); // Trim whitespace

    if (trimmedEntry !== "") {
      // Skip empty strings
      const num = parseFloat(trimmedEntry); // Parse as float

      if (!isNaN(num)) {
        // Check if it's a valid number
        total += num;
      }
    }
  }

  return total;
}
