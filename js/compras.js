// JS para la sección Compras
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionCompras form');
    const tbody = document.querySelector('#seccionCompras table tbody');

    // Función para cargar las compras
    function cargarCompras() {
        fetch('/api/compras')
            .then(res => res.json())
            .then(data => {
                if (tbody) {
                    tbody.innerHTML = '';
                    data.forEach(compra => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${compra.idCompra}</td>
                            <td>${compra.fechaCompra ?? ''}</td>
                            <td>${compra.proveedor ?? ''}</td>
                            <td>${compra.total ?? ''}</td>
                            <td>
                                <button data-id="${compra.idCompra}" class="eliminar">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Evento para agregar nueva compra
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch('/api/compras', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarCompras();
            });
        });
    }

    // Evento para eliminar compra
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/compras/${id}`, {
                    method: 'DELETE'
                })
                .then(() => cargarCompras());
            }
        });
    }

    cargarCompras();
});