'use strict';

$(function () {
  
  var formularioId = $('#frmPessoa').attr('id');
  if(formularioId){
    onClean()
  }

});

async function onConfirm(){
  const cpf = $('#cpf').val().replace(/[.-]/g, '')
  
  let consultButton = $('#buscarBtn');
  consultButton.prop('disabled', true);

  try {

    $('#icon-search').addClass('d-none');
    $('#icon-loading').removeClass('d-none');

    const { data } = await axios.post('/pessoa/confirmar', {
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
