export default function ucFirst(string = "") {
  if (!string) return string;
  return string.length > 1
    ? string.charAt(0).toUpperCase() + string.substr(1)
    : string.toUpperCase();
}
