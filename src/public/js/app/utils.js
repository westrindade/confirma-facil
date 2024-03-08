'use strict';

$(function () {
  
  let mask;
  $('#cpf').on('input', function () {
    
    mask = ['999.999.999-99'];

    $('#cpf').inputmask({
      mask: mask,
      placeholder: '',
      keepStatic: true,
      showMaskOnHover: false,
      showMaskOnFocus: false,
      autoUnmask: true,
      removeMaskOnSubmit: true,
    });
  });
});

function formatDataNascimento(date){
  if(date.length > 0){
    const dataSplit = date.split('-')

    const ano = Number(dataSplit[0])

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const diferencaAnos = anoAtual - ano;
    if (diferencaAnos >= 10)
      return `${dataSplit[2]}-${dataSplit[1]}-${dataSplit[0]}`
    else 
      return null
  }
  return null
}

function showMessage(message, msgType) {

  const alertList = $('#alert-list');
  alertList.html('')
  alertList.removeClass().addClass('alert alert-' + msgType);;

  let icon = '';
  if (msgType == 'danger'){
    icon = 'bi-x-square-fill'
  } else {
    icon = 'bi-check-square-fill'
  }
  alertList.append('<span class="bi '+ icon +'" style="font-size: 1.4em;"></span> <span>' + message + '</span><br>');
}