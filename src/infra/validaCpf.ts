export class ValidaCpf {

  static validate(value: string): boolean {
    const cpf = value.replace(/[^\d]+/g,''); 

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      console.error(`[Pessoa] Cpf ${cpf} com formato inválido.`);
      throw new Error('Cpf com formato inválido.');
    } 

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = (resto === 10 || resto === 11) ? 0 : resto;
  
    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = (resto === 10 || resto === 11) ? 0 : resto;
  
    // Verifica se os dígitos calculados são iguais aos dígitos do CPF
    const isTrue : Boolean = (parseInt(cpf.charAt(9)) === digitoVerificador1 && parseInt(cpf.charAt(10)) === digitoVerificador2);
    if (!isTrue){
      console.error(`[Pessoa] Cpf ${cpf} com formato inválido.`);
      throw new Error('Cpf com formato inválido.');
    }
    return true;
  }

}