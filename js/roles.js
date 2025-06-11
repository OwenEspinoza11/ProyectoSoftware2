document.addEventListener('DOMContentLoaded', function() {
    cargarRoles();

    document.getElementById('formRol').addEventListener('submit', function(e) {
        e.preventDefault();
        const idEdit = document.getElementById('idRolEdit').value;
        const nombre = document.getElementById('nombreRol').value.trim();

        if (!nombre) {
            alert('Por favor ingrese un nombre válido para el rol');
            return;
        }

        if (idEdit) {
            actualizarRol(idEdit, nombre);
        } else {
            agregarRol(nombre);
        }
    });

    document.getElementById('btnCancelarEditRol').addEventListener('click', resetFormRol);
});

function cargarRoles() {
    fetch('http://127.0.0.1:5000/api/roles')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('cuerpoTablaRoles');
            tbody.innerHTML = '';
            data.forEach(rol => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${rol.idRol}</td>
                    <td>${rol.NombreRol}</td>
                    <td>
                        <button class="btn-editar" onclick="editarRol(${rol.idRol}, '${rol.NombreRol.replace(/'/g, "\\'")}')">Editar</button>
                        <button class="btn-eliminar" onclick="eliminarRol(${rol.idRol})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
}

function agregarRol(nombre) {
    fetch('http://127.0.0.1:5000/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        resetFormRol();
        cargarRoles();
    })
    .catch(error => console.error('Error:', error));
}

function actualizarRol(id, nombre) {
    fetch(`http://127.0.0.1:5000/api/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        resetFormRol();
        cargarRoles();
    })
    .catch(error => console.error('Error:', error));
}

function eliminarRol(id) {
    if (!confirm('¿Está seguro de eliminar este rol?')) return;

    fetch(`http://127.0.0.1:5000/api/roles/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        cargarRoles();
    })
    .catch(error => console.error('Error:', error));
}

function editarRol(id, nombre) {
    document.getElementById('idRolEdit').value = id;
    document.getElementById('nombreRol').value = nombre;
    document.getElementById('btnCancelarEditRol').style.display = 'inline-block';
    document.getElementById('nombreRol').focus();
}

function resetFormRol() {
    document.getElementById('formRol').reset();
    document.getElementById('idRolEdit').value = '';
    document.getElementById('btnCancelarEditRol').style.display = 'none';
}

window.editarRol = editarRol;
window.eliminarRol = eliminarRol;