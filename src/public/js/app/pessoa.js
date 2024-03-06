'use strict';

$(function () {
  
  onClean()

});

async function onConfirm(){
  const cpf = $('#cpf').val().replace(/[.-]/g, '')
  
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

    const showNew = true;
    if (!data.success){
      data.errors.forEach(element => {
        showMessage(element.msg, 'danger');

        if (element.msg == "Cpf com formato inválido.")
          showNew = false
      });
      if (showNew)
        enableNew()
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

  let icon = '';
  if (msgType == 'danger'){
    icon = 'bi-x-square-fill'
  } else {
    icon = 'bi-check-square-fill'
  }
  alertList.append('<span class="bi '+ icon +'" style="font-size: 1.4em;"></span> <span>' + message + '</span><br>');
}

async function onAdd(){

  let pessoa = {}
  pessoa.igreja = $('#igrejaSelect').val()
  pessoa.cargo = $('#cargoSelect').val()
  pessoa.nome = $('#nome').val()
  pessoa.cpf = $('#cpf').val()
  pessoa.dataNascimento = $('#dataNascimento').val()

  pessoa.dataNascimento = formatDataNascimento(pessoa.dataNascimento)

  const { data } = await axios.post('/pessoa/new', {
    pessoa,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!data.success){
    data.errors.forEach(element => {
      showMessage(element.msg, 'danger');
    });
  } else {
    showMessage(data.result, 'success');
    disableFormSalvar();
  }
}

function onClean(){
  enableFormSalvar() //form cadastrar

  $('#btnNew').hide()//form consultar
}

function enableFormSalvar(){
  $('#btnCadastrar').show()
  $('#btnLimpar').hide()
}

function disableFormSalvar(){
  $('#btnCadastrar').hide()
  $('#btnLimpar').show()
}

function enableNew(){
  $('#btnNew').removeClass('hidden')
  $('#btnNew').show()
}

// function formatDataNascimento(date){
//   const dataSplit = date.split('-')
//   return `${dataSplit[2]}-${dataSplit[1]}-${dataSplit[0]}`
// }
