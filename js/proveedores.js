//CARGA PERO NO GUARDA NO SÉ POR QUÉ


// JS para la sección Proveedores
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionProveedores form');
    const tbody = document.querySelector('#seccionProveedores table tbody');

    // Función para cargar los proveedores
    function cargarProveedores() {
        fetch('http://127.0.0.1:5000/api/proveedores')
            .then(res => res.json())
            .then(proveedores => {
                if (tbody) {
                    tbody.innerHTML = '';
                    proveedores.forEach(proveedor => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${proveedor.idProveedor}</td>
                            <td>${proveedor.nombreProveedor ?? ''}</td>
                            <td>${proveedor.telefProveedor ?? ''}</td>
                            <td>${proveedor.direccProveedor ?? ''}</td>
                            <td>
                                <button class="editar" data-id="${proveedor.idProveedor}">Editar</button>
                                <button class="eliminar" data-id="${proveedor.idProveedor}">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Agregar o actualizar proveedor
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            const idProveedor = formData.get('idProveedor');

            const url = idProveedor
                ? `http://127.0.0.1:5000/api/proveedores/${idProveedor}`
                : 'http://127.0.0.1:5000/api/proveedores';
            const method = idProveedor ? 'PUT' : 'POST';

            fetch(url, {
                method,
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                form.querySelector('[name="idProveedor"]').value = '';
                cargarProveedores();
            });
        });
    }

    // Editar o eliminar proveedor
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`http://127.0.0.1:5000/api/proveedores/${id}`, { method: 'DELETE' })
                    .then(() => cargarProveedores());
            }
        });
    }

    cargarProveedores();
});
