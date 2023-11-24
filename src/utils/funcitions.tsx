export const setearMiles = (numero: string | number) => {
    if (Number.isNaN(numero)) return 0
    return new Intl.NumberFormat('en-US').format(parseFloat(`${numero}`).toFixed(2) as any)
  }
  