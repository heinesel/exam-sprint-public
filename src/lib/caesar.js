// Caesar cipher on A-Z / a-z. Everything else (digits, punctuation, æøå) is left alone.
export function shift(text, k) {
  const n = ((k % 26) + 26) % 26
  if (!n) return text
  return text.replace(/[A-Za-z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97
    return String.fromCharCode(((ch.charCodeAt(0) - base + n) % 26) + base)
  })
}
