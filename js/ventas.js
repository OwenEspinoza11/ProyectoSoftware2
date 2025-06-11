// JS para la sección Ventas
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionVentas form');
    const tbody = document.querySelector('#seccionVentas table tbody');

    // Función para cargar las ventas
    function cargarVentas() {
        fetch('/api/ventas')
            .then(res => res.json())
            .then(data => {
                if (tbody) {
                    tbody.innerHTML = '';
                    data.forEach(venta => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${venta.idVenta}</td>
                            <td>${venta.fechaVenta ?? ''}</td>
                            <td>${venta.cliente ?? ''}</td>
                            <td>${venta.total ?? ''}</td>
                            <td>
                                <button data-id="${venta.idVenta}" class="eliminar">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Evento para agregar nueva venta
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch('/api/ventas', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarVentas();
            });
        });
    }

    // Evento para eliminar venta
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/ventas/${id}`, {
                    method: 'DELETE'
                })
                .then(() => cargarVentas());
            }
        });
    }

    cargarVentas();
});