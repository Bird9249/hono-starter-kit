export default function generateRandomNumber(): number {
  const length = 10
  let result = ''

  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10)
    result += digit.toString()
  }

  return Number(result)
}
