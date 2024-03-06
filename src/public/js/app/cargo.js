'use strict';
async function loadCargos() {
  
  try {
    const { data } = await axios.get('/cargo/listarTodosCargos', {})

    if (data.success){
      const cargoSelect = $('#cargoSelect');
      cargoSelect.empty();

      data.result.forEach(cargo => {
        cargoSelect.append($('<option>', {
          value: cargo,
          text: cargo
        }));
      })
    } 
    
  } catch (error) {
    console.error('Erro na solicitação:', error);
  }
};

document.addEventListener('DOMContentLoaded', loadCargos);