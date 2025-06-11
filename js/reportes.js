// Llama a tu backend para obtener los datos de los reportes
document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/reportes/dashboard')
        .then(res => res.json())
        .then(data => {
            document.getElementById('totalClientes').textContent = data.totalClientes ?? '0';
            document.getElementById('totalProductos').textContent = data.totalProductos ?? '0';
            document.getElementById('totalVentas').textContent = data.totalVentas ?? '0';
            document.getElementById('totalCompras').textContent = data.totalCompras ?? '0';
            document.getElementById('totalDevoluciones').textContent = data.totalDevoluciones ?? '0';

            // Gráfico de ventas por mes
            if (data.ventasPorMes) {
                const ctx = document.getElementById('graficoVentasMes').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.ventasPorMes.map(v => v.mes),
                        datasets: [{
                            label: 'Ventas por mes',
                            data: data.ventasPorMes.map(v => v.total),
                            backgroundColor: '#4e73df'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
            }
        })
        .catch(() => {
            document.getElementById('totalClientes').textContent = 'Error';
            document.getElementById('totalProductos').textContent = 'Error';
            document.getElementById('totalVentas').textContent = 'Error';
            document.getElementById('totalCompras').textContent = 'Error';
            document.getElementById('totalDevoluciones').textContent = 'Error';
        });
});