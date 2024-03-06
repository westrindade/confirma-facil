'use strict';
async function onConsult(){
  const cpf = $('#cpf').val()
  let consultButton = $('#buscarBtn');
  consultButton.prop('disabled', true);

  try {

    $('#icon-search').addClass('d-none');
    $('#icon-loading').removeClass('d-none');

    const { data } = await axios.post('/pessoa/consultar', {
      cpf: cpf,
    })

    $('#icon-search').removeClass('d-none');
    $('#icon-loading').addClass('d-none');

    if (!data.success){
      data.errors.forEach(element => {
        showMessage(element.msg, 'danger');
      });
    } else {
      if (data.result.outMensagem) {
        //$('#result-table').addClass('d-none');
        showMessage(resp.data.result.outMensagem, 'warning');
      } else {
        const msg = `${data.result.nome} sua presença foi confirmada!`
        showMessage(msg,'success')
        
        const cpfInput = $('#cpf');
        cpfInput.val('')
      }
    }
    
  } catch (error) {
    console.error('Erro na solicitação:', error);
  }

}

function showMessage(message, msgType) {

  const alertList = $('#alert-list');
  alertList.html('')
  alertList.removeClass().addClass('alert alert-' + msgType);;
  //alertList.addClass('alert alert-' + msgType);

  let icon = '';
  if (msgType == 'danger'){
    icon = 'bi-x-square-fill'
  } else {
    icon = 'bi-check-square-fill'
  }
  alertList.append('<span class="bi '+ icon +'" style="font-size: 1.4em;"></span> <span>' + message + '</span><br>');
}

// function redirect(url, parametro){
//   localStorage.setItem('cpf', parametro);
//   window.location.href = url;
// }

async function onAdd(){
  alert('cheguei')

  // let pessoa = {}
  // pessoa.igreja = $('#igrejaSelect').val()
  // pessoa.cargo = $('#cargoSelect').val()
  // pessoa.nome = $('#nome').val()
  // pessoa.cpf = $('#cpf').val()
  // pessoa.dataNascimento = $('#dataNascimento').val()

  // console.alert('pessoa'+pessoa)
  // console.log('pessoa',pessoa)

  // const { data } = await axios.post('/pessoa/new', {
  //   pessoa: pessoa,
  // })

  console.log('pessoa.js - data',data)
  if (!data.success){
    console.log('pessoa.js - caiu if')
    data.errors.forEach(element => {
      showMessage(element.msg, 'danger');
    });
  } else {
    console.log('pessoa.js - caiu else')
  }
}

