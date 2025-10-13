//SESIÓN Y VALIDACIONES
const token = sessionStorage.getItem("authToken");
if (!token) {
  Swal.fire({
    icon: 'warning',
    title: 'Sesión requerida',
    text: 'Inicia sesión primero',
    confirmButtonText: 'Aceptar' 
  }).then(() => {
    window.location.href = "./index.html";
  });
  throw new Error("Sesión no válida");
}

//URL PARA LA API
const urlApi = "https://tienda-eyzc.onrender.com/api";

//REFERENCIAS AL DOM EN UN OBJETO
const DOM = {
  nombreUsuario: document.getElementById("nombre-usuario"),
  btnLogout: document.getElementById("btn-logout"),

  tablas: {
    categorias: document.getElementById("tabla-categorias"),
    productos: document.getElementById("tabla-productos"),
    imagenes: document.getElementById("tabla-imagenes")
  },

  botones: {
    agregarCategoria: document.getElementById("agregar-categoria"),
    agregarProducto: document.getElementById("agregar-producto"),
    agregarImagen: document.getElementById("agregar-imagen"),
    cerrarModal: document.querySelectorAll(".cerrar-btn"),
    cancelarCategoria: document.getElementById("cancelar-categoria"),
    cancelarProducto: document.getElementById("cancelar-producto"),
    cancelarImagen: document.getElementById("cancelar-imagen")
  },

  modales: {
    categoria: document.getElementById("agregar-categoria-modal"),
    producto: document.getElementById("agregar-producto-modal"),
    imagen: document.getElementById("agregar-imagen-modal")
  },

  formularios: {
    categoria: document.getElementById("formulario-categoria"),
    producto: document.getElementById("formulario-producto"),
    imagen: document.getElementById("image-form")
  },

  inputs: {
    idCategoriaInput: document.getElementById("categoria-id"),
    categoriaNombre: document.getElementById("categoria-nombre"),
    categoriaSelect: document.getElementById("categoria-producto-select"),
    idProductoInput: document.getElementById("producto-id"),
    nombreProducto: document.getElementById("product-name"),
    precioProducto: document.getElementById("product-price"),
    descripcionProducto: document.getElementById("product-description"),
    idImagenInput: document.getElementById("imagen-id"),
    imagenSelect: document.getElementById("imagen-producto-select"),
    imagenUrl: document.getElementById("image-url")
  },

  titulos: {
    categoria: document.getElementById("titulo-formulario-categoria"),
    producto: document.getElementById("titulo-formulario-producto"),
    imagen: document.getElementById("titulo-formulario-imagen")
  }
};

//FUNCIONES UTILITARIAS
const fetchData = async (endpoint) => {
  try {
    const res = await fetch(`${urlApi}/${endpoint}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err.message);
    return [];
  }
};

const crearOpcionSelect = (select, data, placeholder) => {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  data.forEach(item => {
    select.innerHTML += `<option value=${item.id}>${item.nombre}</option>`;
  });
};

const crearFilaTabla = (tabla, htmlFila) => {
  const tr = document.createElement("tr");
  tr.innerHTML = htmlFila;
  tabla.appendChild(tr);
};

const abrirModal = (modal) => {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const cerrarModal = (modal) => {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
};

//TABLAS MOSTRADAS DINAMICAMENTE
const mostrarTablaCategorias = async () => {
  const categorias = await fetchData("categorias");
  categorias.forEach(categoria => {
    crearFilaTabla(DOM.tablas.categorias, `
      <td class="px-6 py-4 whitespace-nowrap">${categoria.id}</td>
      <td class="px-6 py-4 whitespace-nowrap">${categoria.nombre}</td>
      <td>
        <button class="btn-editar-categoria text-yellow-500 mr-2" data-id=${categoria.id}><i class="fas fa-edit"></i></button>
        <button class="btn-eliminar-categoria text-red-500" data-id=${categoria.id}><i class="fas fa-trash"></i></button>
      </td>
    `);
  });
};

const mostrarTablaProductos = async () => {
  const productos = await fetchData("productos");
  productos.forEach(producto => {
    crearFilaTabla(DOM.tablas.productos, `
      <td class="px-6 py-4 whitespace-nowrap">${producto.id}</td>
      <td class="px-6 py-4 whitespace-nowrap">${producto.nombre}</td>
      <td class="px-6 py-4 whitespace-nowrap">${producto.categoria}</td>
      <td class="px-6 py-4 whitespace-nowrap">S/ ${producto.precio}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button class="btn-editar-producto text-yellow-500 mr-2" data-id=${producto.id}><i class="fas fa-edit"></i></button>
        <button class="btn-eliminar-producto text-red-500" data-id=${producto.id}><i class="fas fa-trash"></i></button>
      </td>
    `);
  });
};

const mostrarTablaImagenes = async () => {
  const imagenes = await fetchData("imagenes");
  imagenes.forEach(imagen => {
    crearFilaTabla(DOM.tablas.imagenes, `
      <td>${imagen.id}</td>
      <td><img src="${imagen.url}" class="w-16 h-16 object-cover rounded"></td>
      <td>${imagen.nombre}</td>
      <td>
        <button class="btn-editar-imagen text-yellow-500 mr-2" data-id=${imagen.id}><i class="fas fa-edit"></i></button>
        <button class="btn-eliminar-imagen text-red-500" data-id=${imagen.id}><i class="fas fa-trash"></i></button>
      </td>
    `);
  });
};

//MODALES (abrir formularios)
const abrirFormularioCategoria = async (id = null) => {
  if (id) {
    DOM.titulos.categoria.textContent = "Editar Categoría";
    const categoria = (await fetchData("categorias")).find(c => c.id == id);
    if (categoria){ 
      DOM.inputs.categoriaNombre.value = categoria.nombre;
      DOM.inputs.idCategoriaInput.value = categoria.id;
    };
  } else {
    DOM.titulos.categoria.textContent = "Agregar Categoría";
    DOM.formularios.categoria.reset();
    DOM.inputs.idCategoriaInput.value = ""; 
  }
  abrirModal(DOM.modales.categoria);
};

const abrirFormularioProducto = async (id = null) => {
  const categorias = await fetchData("categorias");
  crearOpcionSelect(DOM.inputs.categoriaSelect, categorias, "Selecciona categoría");

  if (id) {
    DOM.titulos.producto.textContent = "Editar Producto";
    const producto = (await fetchData("productos")).find(p => p.id == id);
    if (producto) {
      DOM.inputs.idProductoInput.value = producto.id;
      DOM.inputs.nombreProducto.value = producto.nombre;
      DOM.inputs.precioProducto.value = producto.precio;
      DOM.inputs.descripcionProducto.value = producto.descripcion;

      const categoriaId = categorias.find(c => c.nombre === producto.categoria)?.id;
      if (categoriaId) DOM.inputs.categoriaSelect.value = categoriaId;
    }
  } else {
    DOM.titulos.producto.textContent = "Agregar Producto";
    DOM.formularios.producto.reset();
    DOM.inputs.idProductoInput.value = "";
  }
  abrirModal(DOM.modales.producto);
};

const abrirFormularioImagen = async (id = null) => {
  const productos = await fetchData("productos");
  crearOpcionSelect(DOM.inputs.imagenSelect, productos, "Selecciona Producto");

  if (id) {
    DOM.titulos.imagen.textContent = "Editar Imagen";
    const imagen = (await fetchData("imagenes")).find(i => i.id == id);
    if (imagen) {
      DOM.inputs.idImagenInput.value = imagen.id;
      DOM.inputs.imagenSelect.value = imagen.producto_id;
      DOM.inputs.imagenUrl.value = imagen.url;
    }
  } else {
    DOM.titulos.imagen.textContent = "Agregar Imagen";
    DOM.formularios.imagen.reset();
    DOM.inputs.idImagenInput.value = "";
  }
  abrirModal(DOM.modales.imagen);
};

// EVENTOS DE BOTONES
DOM.btnLogout.addEventListener("click", () => {
  Swal.fire({
    title: 'Cerrar sesión',
    text: '¿Estás seguro de que deseas salir?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.clear();
      window.location.href = "./index.html";
    }
  });
});

// Abrir modales
DOM.botones.agregarCategoria.addEventListener("click", () => abrirFormularioCategoria());
DOM.botones.agregarProducto.addEventListener("click", () => abrirFormularioProducto());
DOM.botones.agregarImagen.addEventListener("click", () => abrirFormularioImagen());

// Cerrar modales
DOM.botones.cerrarModal.forEach(btn => btn.addEventListener("click", () => {
  Object.values(DOM.modales).forEach(cerrarModal);
}));

//Botones cancelar
DOM.botones.cancelarCategoria.addEventListener("click", () => {
  cerrarModal(DOM.modales.categoria);
});

DOM.botones.cancelarProducto.addEventListener("click", () => {
  cerrarModal(DOM.modales.producto);
});

DOM.botones.cancelarImagen.addEventListener("click", () => {
  cerrarModal(DOM.modales.imagen);
});

// Delegación de eventos para los botones editar/eliminar de las tablas
const delegarAcciones = (tabla, editarCb, eliminarCb) => {
  tabla.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.classList.contains("btn-editar-categoria")) editarCb(id);
    if (btn.classList.contains("btn-eliminar-categoria")) eliminarCb(id);

    if (btn.classList.contains("btn-editar-producto")) editarCb(id);
    if (btn.classList.contains("btn-eliminar-producto")) eliminarCb(id);

    if (btn.classList.contains("btn-editar-imagen")) editarCb(id);
    if (btn.classList.contains("btn-eliminar-imagen")) eliminarCb(id);
  });
};

//FUNCION PARA ELIMINAR CATEGORIA, PRODUCTO O IMAGEN SEGUN SU ENDPOINT
const eliminarItem = async (endpoint, id, tabla, mostrarTablaFn) => {
  const nombres = {
    categorias: { singular: "categoría", plural: "categorías" },
    productos: { singular: "producto", plural: "productos" },
    imagenes: { singular: "imagen", plural: "imágenes" }
  };
  const nombre = nombres[endpoint];

  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `Esta acción eliminará la ${nombre.singular} seleccionada`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(`${urlApi}/${endpoint}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const resultado = await response.json();

    if (!response.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: resultado.mensaje || `Error al eliminar ${nombre.singular}`
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: `${nombre.singular} eliminada correctamente`,
      timer: 1500,
      showConfirmButton: false
    });

    // refrescar la tabla
    tabla.innerHTML = "";
    await mostrarTablaFn();

  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'Ocurrió un error con el servidor'
    });
  }
};

delegarAcciones(
  DOM.tablas.categorias,
  abrirFormularioCategoria,
  (id) => eliminarItem("categorias", id, DOM.tablas.categorias, mostrarTablaCategorias)
);

delegarAcciones(
  DOM.tablas.productos,
  abrirFormularioProducto,
  (id) => eliminarItem("productos", id, DOM.tablas.productos, mostrarTablaProductos)
);

delegarAcciones(
  DOM.tablas.imagenes,
  abrirFormularioImagen,
  (id) => eliminarItem("imagenes", id, DOM.tablas.imagenes, mostrarTablaImagenes)
);

//EVENTOS DE SUBMIT 
//AGREGAR/MODIFICAR CATEGORIA
DOM.formularios.categoria.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = DOM.inputs.idCategoriaInput.value;
  const data = { nombre: DOM.inputs.categoriaNombre.value };

  const method = id ? "PUT" : "POST";
  const url = id ? `${urlApi}/categorias/${id}` : `${urlApi}/categorias`;

  try {
    const response = await fetch(url, {
      method,
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'Error en la petición'
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: id ? 'Modificado' : 'Agregado',
      text: id ? 'Categoría modificada' : 'Categoría agregada',
      timer: 1500,
      showConfirmButton: false
    });

    cerrarModal(DOM.modales.categoria);
    DOM.tablas.categorias.innerHTML = "";
    await mostrarTablaCategorias();
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'Ocurrió un error con el servidor'
    });
  }
});

//AGREGAR/MODIFICAR PRODUCTO
DOM.formularios.producto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = DOM.inputs.idProductoInput.value;
  const data = {
    nombre: DOM.inputs.nombreProducto.value,
    precio: DOM.inputs.precioProducto.value,
    descripcion: DOM.inputs.descripcionProducto.value,
    categoria_id: DOM.inputs.categoriaSelect.value
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${urlApi}/productos/${id}` : `${urlApi}/productos`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'Error en la petición'
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: id ? 'Modificado' : 'Agregado',
      text: id ? 'Producto modificado' : 'Producto agregado',
      timer: 1500,
      showConfirmButton: false
    });

    cerrarModal(DOM.modales.producto);
    DOM.tablas.productos.innerHTML = "";
    await mostrarTablaProductos();
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'Ocurrió un error con el servidor'
    });
  }
});

//AGREGAR/MODIFICAR IMAGEN
DOM.formularios.imagen.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = DOM.inputs.idImagenInput.value;
  const data = {
    producto_id: DOM.inputs.imagenSelect.value,
    url: DOM.inputs.imagenUrl.value
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${urlApi}/imagenes/${id}` : `${urlApi}/imagenes`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'Error en la petición'
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: id ? 'Modificado' : 'Agregado',
      text: id ? 'Imagen modificada' : 'Imagen agregada',
      timer: 1500,
      showConfirmButton: false
    });

    cerrarModal(DOM.modales.imagen);
    DOM.tablas.imagenes.innerHTML = "";
    await mostrarTablaImagenes();
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'Ocurrió un error con el servidor'
    });
  }
});

//INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", async () => {
  DOM.nombreUsuario.textContent = sessionStorage.getItem("usuario");
  await mostrarTablaCategorias();
  await mostrarTablaProductos();
  await mostrarTablaImagenes();
});