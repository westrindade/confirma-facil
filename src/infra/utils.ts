export class Utils {
  
  static obterDataConsulta() {
    const date = new Date();

    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
    const ano = String(date.getFullYear());
    const hora = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    const segundos = String(date.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
  }

  static validarCpf(value: string): boolean {
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