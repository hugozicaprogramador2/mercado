document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    
    // Verifica o tipo de usuário baseado no email
    if (email.endsWith('@empresa.com')) {
      // Redireciona o patrão para a interface de admin
      window.location.href = 'patrao_interface.html';
    } else {
      // Redireciona o usuário comum para sua interface
      window.location.href = 'usuario_interface.html';
    }
  });
  