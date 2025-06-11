// JS para la sección Devoluciones
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionDevoluciones form');
    const tbody = document.querySelector('#seccionDevoluciones table tbody');

    // Función para cargar las devoluciones
    function cargarDevoluciones() {
        fetch('/api/devoluciones')
            .then(res => res.json())
            .then(data => {
                if (tbody) {
                    tbody.innerHTML = '';
                    data.forEach(devolucion => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${devolucion.idDevolucion}</td>
                            <td>${devolucion.fechaDevolucion ?? ''}</td>
                            <td>${devolucion.cliente ?? ''}</td>
                            <td>${devolucion.motivo ?? ''}</td>
                            <td>
                                <button data-id="${devolucion.idDevolucion}" class="eliminar">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Evento para agregar nueva devolución
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch('/api/devoluciones', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarDevoluciones();
            });
        });
    }

    // Evento para eliminar devolución
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/devoluciones/${id}`, {
                    method: 'DELETE'
                })
                .then(() => cargarDevoluciones());
            }
        });
    }

    cargarDevoluciones();
});