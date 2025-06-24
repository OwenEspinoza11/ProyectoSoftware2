// JS para la sección Productos
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionProductos form');
    const tbody = document.querySelector('#seccionProductos table tbody');

    // Función para cargar los productos
    function cargarProductos() {
        fetch('http://127.0.0.1:5000/api/productos')
            .then(res => res.json())
            .then(productos => {
                if (tbody) {
                    tbody.innerHTML = '';
                    productos.forEach(producto => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${producto.idProducto}</td>
                            <td>${producto.nombreProducto ?? ''}</td>
                            <td>${producto.descripcionProducto ?? ''}</td>
                            <td>${producto.precioProducto ?? ''}</td>
                            <td>${producto.stockProducto ?? ''}</td>
                            <td>${producto.Estado === 'A' ? 'ACTIVO' : 'INACTIVO'}</td>
                            <td>${producto.fechaRegistro ?? ''}</td>
                            <td>
                                <button class="editar" data-id="${producto.idProducto}">Editar</button>
                                <button class="eliminar" data-id="${producto.idProducto}">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Agregar o actualizar producto
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            const idProducto = formData.get('idProducto');
            const estado = formData.get('Estado') === 'ACTIVO' ? 'A' : 'I';
            formData.set('Estado', estado);

            const url = idProducto
                ? `http://127.0.0.1:5000/api/productos/${idProducto}`
                : 'http://127.0.0.1:5000/api/productos';
            const method = idProducto ? 'PUT' : 'POST';

            fetch(url, {
                method,
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                form.querySelector('[name="idProducto"]').value = '';
                cargarProductos();
            });
        });
    }

    // Editar o eliminar producto
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('editar')) {
                const id = e.target.dataset.id;
                fetch(`http://127.0.0.1:5000/api/productos/${id}`)
                    .then(res => res.json())
                    .then(producto => {
                        form.querySelector('[name="idProducto"]').value = producto.idProducto;
                        form.querySelector('[name="nombreProducto"]').value = producto.nombreProducto ?? '';
                        form.querySelector('[name="descripcionProducto"]').value = producto.descripcionProducto ?? '';
                        form.querySelector('[name="precioProducto"]').value = producto.precioProducto ?? '';
                        form.querySelector('[name="stockProducto"]').value = producto.stockProducto ?? '';
                        form.querySelector('[name="Estado"]').value = producto.Estado === 'A' ? 'ACTIVO' : 'INACTIVO';
                    });
            }
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`http://127.0.0.1:5000/api/productos/${id}`, { method: 'DELETE' })
                    .then(() => cargarProductos());
            }
        });
    }

    cargarProductos();
});
