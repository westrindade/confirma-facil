'use strict';
var dadosList;
var pessoaValueSelect

$(function () {

  $("#igrejaSelect").on("change", function() {
    var igrejaSelec = $(this).val();

    preenchePessoa(igrejaSelec)
  });

  $("#pessoaSelect").on("change", function() {
    pessoaValueSelect = $(this).val();
  });

  var formularioId = $('#frmJustificativa').attr('id');
  if(formularioId){
    loadJustificativa()
  }

});

async function loadJustificativa() {
  
  try {
    const { data } = await axios.get('/pessoa/listar', {})

    if (data.success){
      dadosList = data.result;
      preencheIgreja()
    } 
    
  } catch (error) {
    console.error('Erro na solicitação:', error);
  }

  function preencheIgreja(){
    const igrejaSelect = $('#igrejaSelect');
    igrejaSelect.empty();

    var igrejasList = [...new Set(dadosList.map(item => item.igreja))];

    igrejaSelect.append($('<option>', {
      value: '',
      text: 'Selecione uma Igreja',
      selected: true
    }));

    igrejasList.forEach(item => {
      igrejaSelect.append($('<option>', {
        value: item,
        text: item
      }));
    })
  }
}

async function preenchePessoa(igreja){
  const pessoaSelect = $('#pessoaSelect');
  pessoaSelect.empty();

  var pessoasList = dadosList.filter(item => item.igreja === igreja)

  pessoaSelect.append($('<option>', {
    value: '',
    text: 'Selecione uma Pessoa',
    selected: true
  }));

  pessoasList.forEach(item => {
    pessoaSelect.append($('<option>', {
      value: item.cpf,
      text: item.nome
    }));
  })
}

async function onSendJustificativa(){
  const justificativa = $('#justificativa').val()

  try {

    const { data } = await axios.post('/pessoa/justificativa', {
      cpf: pessoaValueSelect,
      justificativa: justificativa
    })

    if (!data.success){
      data.errors.forEach(element => {
        showMessage(element.msg, 'danger');
      });
      if (showNew)
        enableNew()
    } else {
      showMessage('Justificativa salva com sucesso!','success')
    }
    
  } catch (error) {
    console.error('Erro na solicitação:', error);
  }

}