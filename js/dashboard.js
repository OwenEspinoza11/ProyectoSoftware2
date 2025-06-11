function mostrarSeccion(id) {
    // Oculta todas las secciones
    document.querySelectorAll('.seccion').forEach(function(sec) {
        sec.style.display = 'none';
    });
    // Muestra la sección seleccionada
    var seccion = document.getElementById(id);
    if (seccion) {
        seccion.style.display = 'block';
    }
    // Resalta el botón activo
    document.querySelectorAll('.sidebar ul li').forEach(function(li) {
        li.classList.remove('active');
    });
    var items = document.querySelectorAll('.sidebar ul li');
    items.forEach(function(li) {
        if (li.getAttribute('onclick') === "mostrarSeccion('" + id + "')") {
            li.classList.add('active');
        }
    });
}
// Mostrar solo la sección de inicio al cargar
window.onload = function() {
    mostrarSeccion('seccionInicio');
};