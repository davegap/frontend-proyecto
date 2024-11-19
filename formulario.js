const API_URL = "https://backend-1-bclm.onrender.com/usuarios";
let usuarioSeleccionadoId = null;

// Verificar disponibilidad del backend
function verificarBackend() {
  fetch(API_URL, { method: "HEAD" }) // HEAD solo verifica si el recurso está disponible
    .then(function(response) {
      if (response.ok) {
        alert("Backend conectado");
        obtenerUsuarios(); // Cargar usuarios si el backend está disponible
      } else {
        alert("Error: Backend no disponible");
      }
    })
    .catch(function(error) {
      alert("Error: No se pudo conectar con el backend");
      console.error(error);
    });
}

// Crear usuario
function crearUsuario() {
  const usuario = obtenerDatosFormulario();
  
  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  })
  .then(function(response) {
    if (response.ok) {
      obtenerUsuarios();
      limpiarDatos();
    } else {
      alert("Error al crear usuario");
    }
  });
}

// Leer todos los usuarios y mostrarlos en la tabla
function obtenerUsuarios() {
  fetch(API_URL)
    .then(function(response) {
      return response.json();
    })
    .then(function(usuarios) {
      actualizarTabla(usuarios);
    });
}

// Actualizar usuario
function actualizarUsuario(id) {
  const usuario = obtenerDatosFormulario();
  
  fetch(API_URL + '/' + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  })
  .then(function(response) {
    if (response.ok) {
      obtenerUsuarios();
      limpiarDatos();
      document.getElementById("confirmarEdicionBtn").disabled = true;
      usuarioSeleccionadoId = null;
    } else {
      alert("Error al actualizar usuario");
    }
  });
}

// Eliminar usuario
function eliminarUsuario(id) {
  fetch(API_URL + '/' + id, { method: "DELETE" })
    .then(function(response) {
      if (response.ok) {
        obtenerUsuarios();
      } else {
        alert("Error al eliminar usuario");
      }
    });
}

// Obtener datos del formulario
function obtenerDatosFormulario() {
  return {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    eps: document.getElementById("eps").value,
    edad: parseInt(document.getElementById("edad").value),
    genero: document.querySelector('input[name="genero"]:checked').value,
    suscripcion: document.getElementById("suscripcion").checked ? "Sí" : "No"
  };
}

// Actualizar la tabla de usuarios
function actualizarTabla(usuarios) {
  const tabla = document.getElementById("usuariosTabla");
  tabla.innerHTML = "";

  usuarios.forEach(function(usuario) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${usuario.nombre}</td>
      <td>${usuario.apellido}</td>
      <td>${usuario.eps}</td>
      <td>${usuario.edad}</td>
      <td>${usuario.genero}</td>
      <td>${usuario.suscripcion}</td>
      <td>
        <button onclick="editarUsuario('${usuario._id}')" class="btn btn-secondary">Editar</button>
        <button onclick="eliminarUsuario('${usuario._id}')" class="btn btn-danger">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Cargar los datos del usuario en el formulario para editar
function editarUsuario(id) {
  fetch(API_URL + '/' + id)
    .then(function(response) {
      return response.json();
    })
    .then(function(usuario) {
      document.getElementById("nombre").value = usuario.nombre;
      document.getElementById("apellido").value = usuario.apellido;
      document.getElementById("eps").value = usuario.eps;
      document.getElementById("edad").value = usuario.edad;
      document.getElementById(usuario.genero.toLowerCase()).checked = true;
      document.getElementById("suscripcion").checked = usuario.suscripcion === "Sí";

      usuarioSeleccionadoId = id; // Guardar ID del usuario seleccionado
      document.getElementById("confirmarEdicionBtn").disabled = false;
    });
}

// Confirmar edición
function confirmarEdicion() {
  if (usuarioSeleccionadoId) {
    actualizarUsuario(usuarioSeleccionadoId);
  }
}

// Filtrar usuarios
function filtrarUsuarios() {
  const textoBusqueda = document.getElementById("buscarInput").value.toLowerCase();
  
  fetch(API_URL)
    .then(function(response) {
      return response.json();
    })
    .then(function(usuarios) {
      const usuariosFiltrados = usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(textoBusqueda) || 
        usuario.apellido.toLowerCase().includes(textoBusqueda)
      );
      actualizarTabla(usuariosFiltrados);
    });
}

// Cargar usuarios al inicio
document.addEventListener("DOMContentLoaded", verificarBackend);

// Función para limpiar el formulario
function limpiarDatos() {
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("eps").selectedIndex = 0;
  document.getElementById("edad").value = "";
  document.getElementById("masculino").checked = false;
  document.getElementById("femenino").checked = false;
  document.getElementById("suscripcion").checked = false;

  usuarioSeleccionadoId = null;
  document.getElementById("confirmarEdicionBtn").disabled = true;
}

