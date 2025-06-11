// JS para la sección Proveedores
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionProveedores form');
    const tbody = document.querySelector('#seccionProveedores table tbody');

    // Función para cargar los proveedores
    function cargarProveedores() {
        fetch('/api/proveedores')
            .then(res => res.json())
            .then(data => {
                if (tbody) {
                    tbody.innerHTML = '';
                    data.forEach(proveedor => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${proveedor.idProveedor}</td>
                            <td>${proveedor.nombreProveedor ?? ''}</td>
                            <td>${proveedor.contacto ?? ''}</td>
                            <td>${proveedor.telefono ?? ''}</td>
                            <td>
                                <button data-id="${proveedor.idProveedor}" class="eliminar">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Evento para agregar nuevo proveedor
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch('/api/proveedores', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarProveedores();
            });
        });
    }

    // Evento para eliminar proveedor
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/proveedores/${id}`, {
                    method: 'DELETE'
                })
                .then(() => cargarProveedores());
            }
        });
    }

    cargarProveedores();
});