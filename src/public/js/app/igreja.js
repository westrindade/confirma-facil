'use strict';
async function loadIgrejas() {
  
  try {
    const { data } = await axios.get('/igreja/listarTodasIgrejas', {})

    if (data.success){
      const igrejaSelect = $('#igrejaSelect');
      igrejaSelect.empty();

      data.result.forEach(cargo => {
        igrejaSelect.append($('<option>', {
          value: cargo,
          text: cargo
        }));
      })
    } 
    
  } catch (error) {
    console.error('Erro na solicitação:', error);
  }
};

document.addEventListener('DOMContentLoaded', loadIgrejas);