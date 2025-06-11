//ESTE NO DA TODAVIA

// JS para la sección Clientes
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#seccionClientes form');
    const tbody = document.querySelector('#seccionClientes table tbody');

    // Función para cargar los clientes
    function cargarClientes() {
        fetch('/api/clientes')
            .then(res => res.json())
            .then(clientes => {
                console.log(clientes); // <-- Agrega esto
                if (tbody) {
                    tbody.innerHTML = '';
                    clientes.forEach(cliente => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${cliente.idCliente}</td>
                            <td>${cliente.primerNomCliente ?? ''}</td>
                            <td>${cliente.segundoNomCliente ?? ''}</td>
                            <td>${cliente.primerApeCliente ?? ''}</td>
                            <td>${cliente.segApeCliente ?? ''}</td>
                            <td>${cliente.telefCliente ?? ''}</td>
                            <td>${cliente.emailCliente ?? ''}</td>
                            <td>${cliente.direccionCliente ?? ''}</td>
                            <td>${cliente.Estado === 'A' ? 'ACTIVO' : 'INACTIVO'}</td>
                            <td>${cliente.fechaRegistro ?? ''}</td>
                            <td>
                                <button class="editar" data-id="${cliente.idCliente}">Editar</button>
                                <button class="eliminar" data-id="${cliente.idCliente}">Eliminar</button>
                            </td>
                        `;
                        console.log(tr.innerHTML); // <-- Agrega esto
                        tbody.appendChild(tr);
                    });
                }
            });
    }

    // Agregar o actualizar cliente
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            const idCliente = formData.get('idCliente');
            // Convertir estado a 'A' o 'I'
            const estado = formData.get('Estado') === 'ACTIVO' ? 'A' : 'I';
            formData.set('Estado', estado);

            const url = idCliente ? `/api/clientes/${idCliente}` : '/api/clientes';
            const method = idCliente ? 'PUT' : 'POST';

            fetch(url, {
                method,
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                form.querySelector('[name="idCliente"]').value = '';
                cargarClientes();
            });
        });
    }

    // Editar cliente
    if (tbody) {
        tbody.addEventListener('click', e => {
            if (e.target.classList.contains('editar')) {
                const id = e.target.dataset.id;
                fetch(`/api/clientes/${id}`)
                    .then(res => res.json())
                    .then(cliente => {
                        form.querySelector('[name="idCliente"]').value = cliente.idCliente;
                        form.querySelector('[name="primerNomCliente"]').value = cliente.primerNomCliente ?? '';
                        form.querySelector('[name="segundoNomCliente"]').value = cliente.segundoNomCliente ?? '';
                        form.querySelector('[name="primerApeCliente"]').value = cliente.primerApeCliente ?? '';
                        form.querySelector('[name="segApeCliente"]').value = cliente.segApeCliente ?? '';
                        form.querySelector('[name="telefCliente"]').value = cliente.telefCliente ?? '';
                        form.querySelector('[name="emailCliente"]').value = cliente.emailCliente ?? '';
                        form.querySelector('[name="direccionCliente"]').value = cliente.direccionCliente ?? '';
                        form.querySelector('[name="Estado"]').value = cliente.Estado === 'A' ? 'ACTIVO' : 'INACTIVO';
                    });
            }
            // Eliminar cliente
            if (e.target.classList.contains('eliminar')) {
                const id = e.target.dataset.id;
                fetch(`/api/clientes/${id}`, { method: 'DELETE' })
                    .then(() => cargarClientes());
            }
        });
    }

    cargarClientes();
});