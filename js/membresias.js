// JS para la sección Membresías
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionMembresias form');
    const tbody = document.querySelector('#seccionMembresias table tbody');

    // Función para cargar las membresías
    function cargarMembresias() {
        fetch('/api/membresias')
            .then(res => res.json())
            .then(data => {
                if (tbody) {
                    tbody.innerHTML = '';
                    data.forEach(membresia => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${membresia.idMembresia}</td>
                            <td>${membresia.nombreMembresia ?? ''}</td>
                            <td>${membresia.precio ?? ''}</td>
                            <td>${membresia.duracion ?? ''}</td>
                            <td>
                                <button data-id="${membresia.idMembresia}" class="eliminar">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Evento para agregar nueva membresía
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch('/api/membresias', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarMembresias();
            });
        });
    }

    // Evento para eliminar membresía
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/membresias/${id}`, {
                    method: 'DELETE'
                })
                .then(() => cargarMembresias());
            }
        });
    }

    cargarMembresias();
});