export function capitalizeFirstLetter(string) {
  if (
    typeof string !== "string" ||
    string.length === 0
  ) {
    return string; // Handle non-string or empty inputs
  }

  return (
    string.charAt(0).toUpperCase() +
    string.slice(1)
  );
}
