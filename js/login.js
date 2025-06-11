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
        window.location.href = "dashboard.html";
      })
      .catch(error => {
        alert(error.message);
        console.error("Error de login:", error);
      })
      .finally(() => {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = "Entrar";
      });
  });
});