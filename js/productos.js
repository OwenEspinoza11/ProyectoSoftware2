// JS para la sección Productos
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionProductos form');
    const tbody = document.querySelector('#seccionProductos table tbody');

    // Función para cargar los productos
    function cargarProductos() {
        fetch('/api/productos')
            .then(res => res.json())
            .then(data => {
                if (tbody) {
                    tbody.innerHTML = '';
                    data.forEach(producto => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${producto.idProducto}</td>
                            <td>${producto.nombreProducto ?? ''}</td>
                            <td>${producto.categoria ?? ''}</td>
                            <td>${producto.precio ?? ''}</td>
                            <td>${producto.stock ?? ''}</td>
                            <td>
                                <button data-id="${producto.idProducto}" class="eliminar">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Evento para agregar nuevo producto
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch('/api/productos', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarProductos();
            });
        });
    }

    // Evento para eliminar producto
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/productos/${id}`, {
                    method: 'DELETE'
                })
                .then(() => cargarProductos());
            }
        });
    }

    cargarProductos();
});