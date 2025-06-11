// JS para la sección Categorías de Producto
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionCategorias form');
    const tbody = document.querySelector('#seccionCategorias table tbody');

    // Función para cargar las categorías
    function cargarCategorias() {
        fetch('/api/categorias')
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(cat => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cat.idCategoria}</td>
                        <td>${cat.nombreCategoria}</td>
                        <td>
                            <button data-id="${cat.idCategoria}" class="eliminar">Eliminar</button>
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
        fetch('/api/categorias', {
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
            fetch(`/api/categorias/${id}`, {
                method: 'DELETE'
            })
            .then(() => cargarCategorias());
        }
    });

    cargarCategorias();
});