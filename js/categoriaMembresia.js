//PENDIENTE

// JS para la sección Categoría Membresía

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionCategoriaMembresia form');
    const tbody = document.querySelector('#seccionCategoriaMembresia table tbody');
    
    // Función para cargar las categorías
    function cargarCategorias() {
        fetch('/api/categoria-membresia')
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(cat => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cat.idCategoriaMembresia}</td>
                        <td>${cat.nombreCategoriaMembresia}</td>
                        <td>
                            <button data-id="${cat.idCategoriaMembresia}" class="eliminar">Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            });
    }

    // Evento para agregar nueva categoría
    form.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(form);
        fetch('/api/categoria-membresia', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(() => {
            form.reset();
            cargarCategorias();
        });
    });

    // Evento para eliminar categoría
    tbody.addEventListener('click', e => {
        if (e.target.classList.contains('eliminar')) {
            const id = e.target.dataset.id;
            fetch(`/api/categoria-membresia/${id}`, {
                method: 'DELETE'
            })
            .then(() => cargarCategorias());
        }
    });

    cargarCategorias();
});