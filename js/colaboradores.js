// JS para la sección Colaboradores
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionColaboradores form');
    const tbody = document.querySelector('#seccionColaboradores table tbody');

    // Función para cargar los colaboradores
    function cargarColaboradores() {
        fetch('http://127.0.0.1:5000/api/colaboradores')
            .then(res => res.json())
            .then(colaboradores => {
                const tbody = document.getElementById('cuerpoTablaColaboradores');
                tbody.innerHTML = '';
                colaboradores.forEach(colab => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${colab.idColaborador}</td>
                        <td>${colab.nombreUsuario}</td>
                        <td>${colab.primerNombreColab}</td>
                        <td>${colab.segundoNombreColab}</td>
                        <td>${colab.primerApellidoColab}</td>
                        <td>${colab.segundoApellidoColab}</td>
                        <td>${colab.telefColab}</td>
                        <td>${colab.emailColab}</td>
                        <td>${colab.direccionColab}</td>
                        <td>${colab.fechaIngreso}</td>
                        <td>${colab.cargoColab}</td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error al cargar colaboradores:', error));
    }

    // Evento para agregar nuevo colaborador
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch('/api/colaboradores', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarColaboradores();
            });
        });
    }

    // Evento para eliminar colaborador
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/colaboradores/${id}`, {
                    method: 'DELETE'
                })
                .then(() => cargarColaboradores());
            }
        });
    }

    // Cargar usuarios activos en combo
    function cargarUsuariosActivosEnCombo() {
        fetch('http://127.0.0.1:5000/api/usuarios/activos')
            .then(res => res.json())
            .then(usuarios => {
                const select = document.getElementById('idUsuarioColab');
                select.innerHTML = '<option value="">Seleccione un usuario</option>';
                usuarios.forEach(usuario => {
                    const option = document.createElement('option');
                    option.value = usuario.idUsuario;
                    option.textContent = usuario.nombreUsuario;
                    select.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar usuarios activos:', error));
    }

    cargarColaboradores();
    cargarUsuariosActivosEnCombo();
});