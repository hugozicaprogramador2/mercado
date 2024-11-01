function updateProfileImage(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('profile-image').src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecione um arquivo de imagem válido (ex: .jpg, .png).");
    }
  }
  
  function salvarDados(event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    // Aqui você pode adicionar validações adicionais, se necessário
  
    // Redireciona para a página desejada
    window.location.href = 'paginaDestino.html'; // Substitua 'paginaDestino.html' pela URL da página para onde deseja redirecionar
  }
  