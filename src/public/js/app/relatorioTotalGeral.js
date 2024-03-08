'use strict';

var dadosGrid

$(function () {
  
  var formularioId = $('#frmRelTotal').attr('id');

  if (formularioId){
    onLoad()
  }

});

async function onLoad(){

  try {

    const { data } = await axios.get('/relatorio/total/listar', {})
    
    if (data.success){

      dadosGrid = data.result

      $("#lblTotal").text(data.result.total.total);
      $("#lblPresentes").text(data.result.presente.total);
      $("#lblJustificados").text(data.result.justificativa.total);
      $("#lblAusentes").text(data.result.ausente.total);
    }

  } catch (error) {
    console.error('Erro na solicitação:', error);
  }

}

async function loadGrid(event,classColor){

  let dados;
  switch(event){
    case 'justificativa':
      dados = dadosGrid.justificativa.list
      break
    case 'presentes':
      dados = dadosGrid.presente.list
      break
    case 'ausente':
      dados = dadosGrid.ausente.list
      break
    case 'total':
      dados = dadosGrid.total.list
      break
  }

  clearGrid();
  dados.forEach(element => {
    preencheGrid(classColor,element.igreja,element.cargo,element.nome)
  });
}

function clearGrid(){  $("#table-body").empty(); }

function preencheGrid(classColor,igreja,cargo,nome){
  var classC = "table-"+classColor

  var row = $("<tr>").addClass(classC);;
  row.append($("<td>").text(igreja));
  row.append($("<td>").text(cargo));
  row.append($("<td>").text(nome));
  $("#table-body").append(row);
}