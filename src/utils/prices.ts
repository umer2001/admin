import { currencies } from "./currencies"

export function normalizeAmount(currency: string, amount: number): number {
  let divisor = getDecimalDigits(currency)
  return Math.floor(amount) / divisor
}

export function displayAmount(currency: string, amount: number) {
  const normalizedAmount = normalizeAmount(currency, amount)
  return normalizedAmount.toFixed(
    currencies[currency.toUpperCase()].decimal_digits
  )
}

export const extractUnitPrice = (item, region, withTax = true) => {
  let itemPrice = item.unit_price

  if (itemPrice === undefined) {
    const regionPrice = item.prices.find(
      (p) => p.currency_code === region.currency_code
    )

    itemPrice = regionPrice.amount
  }

  if (itemPrice) {
    if (withTax) {
      return itemPrice * (1 + region.tax_rate / 100)
    } else {
      return itemPrice
    }
  }

  return 0
}

export const displayUnitPrice = (item, region) => {
  const currCode = region.currency_code.toUpperCase()

  let price = extractUnitPrice(item, region)
  return `${displayAmount(currCode, price)} ${currCode}`
}

export const extractOptionPrice = (price, region) => {
  let amount = price
  amount = (amount * (1 + region.tax_rate / 100)) / 100
  return `${amount} ${region.currency_code.toUpperCase()}`
}

export function persistedPrice(currency: string, amount: number): number {
  const multiplier = getDecimalDigits(currency)
  return Math.floor(amount) * multiplier
}

/**
 * Checks the list of currencies and returns the divider/multiplier
 * that should be used to calculate the persited and display amount.
 */
export function getDecimalDigits(currency: string) {
  const divisionDigits = currencies[currency.toUpperCase()].decimal_digits
  return Math.pow(10, divisionDigits)
}