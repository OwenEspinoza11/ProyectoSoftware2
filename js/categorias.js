// JS para la sección Categorías de Producto
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionCategorias form');
    const tbody = document.querySelector('#seccionCategorias table tbody');

    // Función para cargar las categorías
    function cargarCategorias() {
        fetch('http://127.0.0.1:5000/api/categorias')
            .then(res => res.json())
            .then(categorias => {
                console.log(categorias);
                if (tbody) {
                    tbody.innerHTML = '';
                    categorias.forEach(cat => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${cat.idCategoria}</td>
                            <td>${cat.nombreCategoria ?? ''}</td>
                            <td>
                                <button class="editar" data-id="${cat.idCategoria}">Editar</button>
                                <button class="eliminar" data-id="${cat.idCategoria}">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Agregar o actualizar categoría
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            const idCategoria = formData.get('idCategoriaEdit');
            const nombreCategoria = formData.get('nombreCategoria')?.trim();

            if (!nombreCategoria) {
                alert('Por favor ingrese un nombre válido para la categoría');
                return;
            }

            const url = idCategoria
                ? `http://127.0.0.1:5000/api/categorias/${idCategoria}`
                : 'http://127.0.0.1:5000/api/categorias';
            const method = idCategoria ? 'PUT' : 'POST';
            const body = JSON.stringify({ nombreCategoria });

            fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body
            })
            .then(res => res.json())
            .then(data => {
                alert(data.mensaje || (idCategoria ? 'Categoría actualizada' : 'Categoría agregada'));
                form.reset();
                form.querySelector('[name="idCategoriaEdit"]').value = '';
                const btnCancelar = form.querySelector('#btnCancelarEditCategoria');
                if (btnCancelar) btnCancelar.style.display = 'none';
                cargarCategorias();
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Editar o eliminar categoría
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('editar')) {
                const id = e.target.dataset.id;
                fetch(`http://127.0.0.1:5000/api/categorias/${id}`)
                    .then(res => res.json())
                    .then(cat => {
                        form.querySelector('[name="idCategoriaEdit"]').value = cat.idCategoria;
                        form.querySelector('[name="nombreCategoria"]').value = cat.nombreCategoria ?? '';
                        const btnCancelar = form.querySelector('#btnCancelarEditCategoria');
                        if (btnCancelar) btnCancelar.style.display = 'inline-block';
                        form.querySelector('[name="nombreCategoria"]').focus();
                    });
            }
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                if (!confirm('¿Está seguro de eliminar esta categoría?')) return;
                fetch(`http://127.0.0.1:5000/api/categorias/${id}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.mensaje || 'Categoría eliminada');
                        cargarCategorias();
                    });
            }
        });
    }

    // Cancelar edición
    const btnCancelar = document.querySelector('#btnCancelarEditCategoria');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            form.reset();
            form.querySelector('[name="idCategoriaEdit"]').value = '';
            btnCancelar.style.display = 'none';
        });
    }

    cargarCategorias();
});
