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

  // Função para criar botão de download
  function createDownloadButton(extension) {
    const button = newWindow.document.createElement('button');
    button.textContent = `Baixar arquivo com a extensão .${extension}`;
    button.onclick = function () {
      const blob = new Blob([texto_utf8], { type: 'text/plain;charset=utf-8' });
      const fileName = `resultado.${extension}`;
      const downloadLink = newWindow.document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      newWindow.document.body.appendChild(downloadLink);
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
      newWindow.document.body.removeChild(downloadLink);
    };
    return button;
  }

  // Criar e adicionar botões de download para .txt e .srt
  const downloadButtonTxt = createDownloadButton('txt');
  const downloadButtonSrt = createDownloadButton('srt');

  // Ajustar margens e adicionar botões à nova aba
  newWindow.document.body.insertBefore(downloadButtonSrt, newWindow.document.body.firstChild);
  downloadButtonSrt.style.marginLeft = '10px';
  newWindow.document.body.insertBefore(downloadButtonTxt, newWindow.document.body.firstChild);
}

function displayError(errorMessage) {
  const errorMessages = document.getElementById('errorMessages');
  errorMessages.textContent = errorMessage;
}

function clearError() {
  const errorMessages = document.getElementById('errorMessages');
  errorMessages.textContent = '';
}

const ano = document.getElementById('ano')
ano.textContent = new Date().getFullYear()
