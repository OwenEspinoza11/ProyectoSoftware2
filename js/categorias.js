// JS para la sección Categorías de Producto
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCategoria');

    function cargarCategorias() {
        fetch('http://127.0.0.1:5000/api/categorias')
            .then(res => res.json())
            .then(data => {
                console.log(data); // <-- Agrega esto
                const tbody = document.getElementById('cuerpoTablaCategorias');
                tbody.innerHTML = '';
                data.forEach(cat => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cat.idCategoria}</td>
                        <td>${cat.nombreCategoria}</td>
                        <td>
                            <button class="btn-editar" onclick="editarCategoria(${cat.idCategoria}, '${cat.nombreCategoria.replace(/'/g, "\\'")}')">Editar</button>
                            <button class="btn-eliminar" onclick="eliminarCategoria(${cat.idCategoria})">Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const idEdit = document.getElementById('idCategoriaEdit').value;
        const nombre = document.getElementById('nombreCategoria').value.trim();

        if (!nombre) {
            alert('Por favor ingrese un nombre válido para la categoría');
            return;
        }

        if (idEdit) {
            actualizarCategoria(idEdit, nombre);
        } else {
            agregarCategoria(nombre);
        }
    });

    document.getElementById('btnCancelarEditCategoria').addEventListener('click', resetFormCategoria);

    document.getElementById('cuerpoTablaCategorias').addEventListener('click', e => {
        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.closest('button').getAttribute('onclick').match(/\d+/)[0];
            eliminarCategoria(id);
        }
        // Puedes agregar aquí el evento para editar si lo deseas
    });

    cargarCategorias();
});

function agregarCategoria(nombre) {
    fetch('http://127.0.0.1:5000/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCategoria: nombre })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje || 'Categoría agregada');
        resetFormCategoria();
        document.getElementById('cuerpoTablaCategorias').innerHTML = '';
        cargarCategorias();
    })
    .catch(error => console.error('Error:', error));
}

function actualizarCategoria(id, nombre) {
    fetch(`http://127.0.0.1:5000/api/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCategoria: nombre })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje || 'Categoría actualizada');
        resetFormCategoria();
        cargarCategorias();
    })
    .catch(error => console.error('Error:', error));
}

function eliminarCategoria(id) {
    if (!confirm('¿Está seguro de eliminar esta categoría?')) return;

    fetch(`http://127.0.0.1:5000/api/categorias/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje || 'Categoría eliminada');
        cargarCategorias();
    })
    .catch(error => console.error('Error:', error));
}

function editarCategoria(id, nombre) {
    document.getElementById('idCategoriaEdit').value = id;
    document.getElementById('nombreCategoria').value = nombre;
    document.getElementById('btnCancelarEditCategoria').style.display = 'inline-block';
    document.getElementById('nombreCategoria').focus();
}

function resetFormCategoria() {
    document.getElementById('formCategoria').reset();
    document.getElementById('idCategoriaEdit').value = '';
    document.getElementById('btnCancelarEditCategoria').style.display = 'none';
}

window.editarCategoria = editarCategoria;
window.eliminarCategoria = eliminarCategoria;