export const validateEmail = (_rule:any, value:any, callback:any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || emailRegex.test(value)) {
      callback(); // Válido
    } else {
      callback('Por favor, ingrese una dirección de correo electrónico válida.');
    }
}
export const validateNumber = (_rule:any, value:any, callback:any) => {
  
  if (!value || !isNaN(value)) {
    callback(); // Válido
  } else {
    callback('Por favor, ingrese una dirección de correo electrónico válida.');
  }
}