function decodeFromUrl() {
  const url = document.getElementById('urlInput').value;
  
  if (!url) {
    displayError('Por favor, insira uma URL');
    return;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao obter o texto da URL');
      }
      return response.arrayBuffer();
    })
    .then(arrayBuffer => {
      const decoder = new TextDecoder('utf-8');
      const texto_utf8 = decoder.decode(arrayBuffer);
      displayText(texto_utf8);
    })
    .catch(error => {
      displayError(error.message);
    });
}

function displayText(texto_utf8) {
  clearError();
  // Abrir uma nova aba do navegador para exibir o resultado
  const newWindow = window.open();
  newWindow.document.write('<pre style="padding: 10px;">' + texto_utf8 + '</pre>');
  newWindow.document.head.innerHTML = '<title>Arrumado!</title>';
  newWindow.document.body.style.backgroundColor = '#282828';
  newWindow.document.body.style.color = 'white';

  // Adicionar um botão para fazer o download do arquivo
  const downloadButton = newWindow.document.createElement('button');
  downloadButton.textContent = 'Baixar arquivo';
  downloadButton.onclick = function () {
    const blob = new Blob([texto_utf8], { type: 'text/plain;charset=utf-8' });
    const fileName = 'resultado.txt';
    const downloadLink = newWindow.document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    newWindow.document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
    newWindow.document.body.removeChild(downloadLink);
  };
  newWindow.document.body.insertBefore(downloadButton, newWindow.document.body.firstChild);
}

function displayError(errorMessage) {
  const errorMessages = document.getElementById('errorMessages');
  errorMessages.textContent = errorMessage;
}

function clearError() {
  const errorMessages = document.getElementById('errorMessages');
  errorMessages.textContent = '';
}
