const form = document.getElementById('calificacion-form');
const calificacionesList = document.getElementById('calificaciones-list');
const apiUrl = 'http://localhost:3000/api/calificaciones';

// Obtener todas las calificaciones al cargar la página
async function obtenerCalificaciones() {
  const res = await fetch(apiUrl);
  const { data } = await res.json();

  calificacionesList.innerHTML = '';
  data.forEach(calificacion => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${calificacion.nombre}</td>
      <td>${calificacion.materia}</td>
      <td>${calificacion.calificacion}</td>
      <td>
        <button onclick="editarCalificacion(${calificacion.id}, '${calificacion.nombre}', '${calificacion.materia}', ${calificacion.calificacion})">Editar</button>
        <button onclick="eliminarCalificacion(${calificacion.id})">Eliminar</button>
      </td>
    `;
    calificacionesList.appendChild(row);
  });
}

// Crear o actualizar una calificación
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('calificacion-id').value;
  const nombre = document.getElementById('nombre').value;
  const materia = document.getElementById('materia').value;
  const calificacion = document.getElementById('calificacion').value;

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiUrl}/${id}` : apiUrl;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, materia, calificacion })
  });

  form.reset();
  obtenerCalificaciones();
});

// Editar una calificación
function editarCalificacion(id, nombre, materia, calificacion) {
  document.getElementById('calificacion-id').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('materia').value = materia;
  document.getElementById('calificacion').value = calificacion;
}

// Eliminar una calificación
async function eliminarCalificacion(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  obtenerCalificaciones();
}

// Cargar calificaciones al inicio
obtenerCalificaciones();
