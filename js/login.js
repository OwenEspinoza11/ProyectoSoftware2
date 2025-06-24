document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const Usuario = document.getElementById('Usuario').value.trim();
    const Password = document.getElementById('Password').value;

    // Validación básica
    if (!Usuario || !Password) {
      alert("Por favor complete todos los campos");
      return;
    }

    // Mostrar estado de carga
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = "Autenticando...";

    // Contador de intentos fallidos
    let intentosFallidos = parseInt(localStorage.getItem('intentosFallidos')) || 0;

    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Usuario, Password })
    })
      .then(response => {
        if (!response.ok) throw new Error("Credenciales incorrectas o usuario inactivo");
        return response.json();
      })
      .then(data => {
        localStorage.setItem('usuario', JSON.stringify(data));
        localStorage.removeItem('intentosFallidos');
        window.location.href = "dashboard.html";
      })
      .catch(error => {
        intentosFallidos += 1;
        localStorage.setItem('intentosFallidos', intentosFallidos);
        if (intentosFallidos >= 3) {
          alert("Ha superado el número máximo de intentos. Espere 10 segundos para volver a intentarlo.");
          btn.disabled = true;
          let countdown = 10;
          btn.querySelector('.btn-text').textContent = `Espere ${countdown}s`;
          const interval = setInterval(() => {
            countdown--;
            btn.querySelector('.btn-text').textContent = `Espere ${countdown}s`;
            if (countdown <= 0) {
              clearInterval(interval);
              btn.disabled = false;
              btn.querySelector('.btn-text').textContent = "Entrar";
              localStorage.setItem('intentosFallidos', 0);
            }
          }, 1000);
        } else {
          alert(error.message);
        }
        console.error("Error de login:", error);
      })
      .finally(() => {
        if (intentosFallidos < 3) {
          btn.disabled = false;
          btn.querySelector('.btn-text').textContent = "Entrar";
        }
      });
  });
});
