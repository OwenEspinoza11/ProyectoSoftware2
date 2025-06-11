// JS para la sección Usuarios
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionUsuarios form');
    const tbody = document.querySelector('#seccionUsuarios table tbody');

    // Función para cargar los usuarios
    function cargarUsuarios() {
        fetch('/api/usuarios')
            .then(res => res.json())
            .then(data => {
                if (tbody) {
                    tbody.innerHTML = '';
                    data.forEach(usuario => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${usuario.idUsuario}</td>
                            <td>${usuario.nombreUsuario ?? ''}</td>
                            <td>${usuario.emailUsuario ?? ''}</td>
                            <td>${usuario.rol ?? ''}</td>
                            <td>
                                <button data-id="${usuario.idUsuario}" class="eliminar">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Evento para agregar nuevo usuario
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch('/api/usuarios', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarUsuarios();
            });
        });
    }

    // Evento para eliminar usuario
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/usuarios/${id}`, {
                    method: 'DELETE'
                })
                .then(() => cargarUsuarios());
            }
        });
    }

    cargarUsuarios();
});

document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarios();

    document.getElementById('formUsuario').addEventListener('submit', function(e) {
        e.preventDefault();
        const idEdit = document.getElementById('idUsuarioEdit').value;
        const nombre = document.getElementById('nombreUsuario').value.trim();
        const email = document.getElementById('emailUsuario').value.trim();
        const rol = document.getElementById('rolUsuario').value.trim();
        const estado = document.getElementById('estadoUsuario').value; // <-- Nuevo

        if (!nombre || !email || !rol || !estado) {
            alert('Por favor complete todos los campos');
            return;
        }

        if (idEdit) {
            actualizarUsuario(idEdit, nombre, email, rol, estado); // <-- Pasa estado
        } else {
            agregarUsuario(nombre, email, rol, estado); // <-- Pasa estado
        }
    });

    document.getElementById('btnCancelarEditUsuario').addEventListener('click', resetFormUsuario);
});

function cargarUsuarios() {
    fetch('http://127.0.0.1:5000/api/usuarios')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('cuerpoTablaUsuarios');
            tbody.innerHTML = '';
            data.forEach(usuario => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${usuario.idUsuario}</td>
                    <td>${usuario.nombreUsuario}</td>
                    <td>${usuario.emailUsuario}</td>
                    <td>${usuario.estadoUsuario}</td>
                    <td>${usuario.fechaRegistro}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button class="btn-editar" onclick="editarUsuario(${usuario.idUsuario}, '${usuario.nombreUsuario.replace(/'/g, "\\'")}', '${usuario.emailUsuario.replace(/'/g, "\\'")}', '${usuario.rol.replace(/'/g, "\\'")}')">Editar</button>
                        <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.idUsuario})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
}

function agregarUsuario(nombre, email, rol, estado) {
    fetch('http://127.0.0.1:5000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario: nombre, emailUsuario: email, idRol: rol, estadoUsuario: estado }) // <-- Agrega estadoUsuario
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        resetFormUsuario();
        cargarUsuarios();
    })
    .catch(error => console.error('Error:', error));
}

function actualizarUsuario(id, nombre, email, rol, estado) {
    fetch(`http://127.0.0.1:5000/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario: nombre, emailUsuario: email, idRol: rol, estadoUsuario: estado }) // <-- Agrega estadoUsuario
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        resetFormUsuario();
        cargarUsuarios();
    })
    .catch(error => console.error('Error:', error));
}

function eliminarUsuario(id) {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;

    fetch(`http://127.0.0.1:5000/api/usuarios/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        cargarUsuarios();
    })
    .catch(error => console.error('Error:', error));
}

function editarUsuario(id, nombre, email, idRol, estadoUsuario) {
    document.getElementById('idUsuarioEdit').value = id;
    document.getElementById('nombreUsuario').value = nombre;
    document.getElementById('emailUsuario').value = email;
    document.getElementById('rolUsuario').value = idRol;
    document.getElementById('estadoUsuario').value = estadoUsuario; // <-- Selecciona el estado
    document.getElementById('btnCancelarEditUsuario').style.display = 'inline-block';
    document.getElementById('nombreUsuario').focus();
}

function resetFormUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('idUsuarioEdit').value = '';
    document.getElementById('btnCancelarEditUsuario').style.display = 'none';
}

function cargarRolesEnCombo() {
    fetch('http://127.0.0.1:5000/api/roles')
        .then(res => res.json())
        .then(roles => {
            console.log('Roles recibidos:', roles);
            const select = document.getElementById('rolUsuario');
            console.log('Select encontrado:', select);
            select.innerHTML = '<option value="">Seleccione un rol</option>';
            roles.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.idRol;
                option.textContent = rol.nombreRol;
                select.appendChild(option);
            });
            console.log('Opciones agregadas:', select.innerHTML);
        })
        .catch(error => console.error('Error al cargar roles:', error));
}

// Llama a la función cuando cargue la sección de usuarios
document.addEventListener('DOMContentLoaded', () => {
    cargarRolesEnCombo();
});

window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;