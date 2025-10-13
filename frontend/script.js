//REFERENCIAS AL DOM
const productosContainer = document.getElementById("productos-container");
const categoriasContainer = document.getElementById("categorias-container");
const detallesProducto = document.getElementById("detalle-producto");
const botonCerrar = document.getElementById("close-detail");
const detalleTitulo = document.getElementById("detail-title");
const detalleCategoria = document.getElementById("detail-category");
const detalleDescripcion = document.getElementById("detail-description");
const detallePrecio = document.getElementById("detail-price");
const detalleImagen = document.getElementById("detail-images");
const botonEliminarProducto = document.getElementById("eliminar-producto");
const botonEditarProducto = document.getElementById("editar-producto");

// Header dinámico
const navPublico = document.getElementById("nav-publico");
const navPrivado = document.getElementById("nav-privado");
const nombreUsuario = document.getElementById("nombre-usuario");
const btnLogout = document.getElementById("btn-logout");

//URL PARA LA API
const urlApi = "https://tienda-eyzc.onrender.com/api";
//FUNCIONES FETCH
const obtenerData = async (tipo) => {
  try {
    const response = await fetch(`${urlApi}/${tipo}`);
    if (!response.ok) throw new Error(`Error en el servidor: ${response.status}`);
    const data = await response.json();

    if (tipo === "productos") {
      const productos = await Promise.all(
        data.map(async (producto) => {
          const imagenes = await obtenerImagenes(producto.id);
          return { ...producto, imagenes };
        })
      );
      return productos;
    }
    return data;
  } catch (err) {
    console.error(err.message);
  }
};

const obtenerImagenes = async (idProducto) => {
  try {
    const response = await fetch(`${urlApi}/imagenes/${idProducto}`);
    if (!response.ok) throw new Error(`Error en el servidor: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(err.message);
  }
};

//MOSTRAR DATOS
const mostrarBotones = async (arrayCategorias) => {
  try {
    arrayCategorias.forEach((categoria) => {
      categoriasContainer.innerHTML += `
        <button 
          class="categoria-btn px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" 
          data-categoria="${categoria.nombre}">
          ${categoria.nombre}
        </button>`;
    });
  } catch (err) {
    console.error(err);
  }
};

const mostrarProductos = async (arrayProductos) => {
  productosContainer.innerHTML = "";
  try {
    if (arrayProductos.length > 0) {
      arrayProductos.forEach((producto) => {
    const productoCard = document.createElement("div");
    productoCard.className =
      "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow";

    productoCard.innerHTML = `
      <img src="${producto.imagenes?.[0]?.url || ""}" 
           alt="${producto.nombre}" 
           class="w-full h-48 object-contain bg-white cursor-pointer" 
           data-product-id="${producto.id}">
      <div class="p-4">
        <h3 class="font-semibold text-lg mb-1">${producto.nombre}</h3>
        <p class="text-gray-600 text-sm mb-2">${producto.categoria}</p>
        <p class="text-blue-600 font-bold">S/ ${producto.precio}</p>
      </div>`;

    productosContainer.appendChild(productoCard);
  });

      // Eventos para abrir detalle
      document.querySelectorAll("img[data-product-id]").forEach((element) => {
        element.addEventListener("click", (e) => {
          const productoId = e.target.getAttribute("data-product-id");
          mostrarDetalles(productoId);
        });
      });
    } else {
      productosContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500 text-lg">No se encontraron productos</p>
        </div>`;
    }
  } catch (error) {
    console.error(error);
  }
};

//DETALLES DEL PRODUCTO
const mostrarDetalles = async (idProducto) => {
  const productos = await obtenerData("productos");
  const producto = productos.find((p) => p.id == idProducto);
  if (!producto) return;

  detalleTitulo.textContent = producto.nombre;
  detalleCategoria.textContent = `Categoría: ${producto.categoria}`;
  detalleDescripcion.textContent = producto.descripcion;
  detallePrecio.textContent = `S/ ${producto.precio}`;

  // Limpiar contenido anterior
  const swiperWrapper = document.querySelector("#detail-images .swiper-wrapper");
  swiperWrapper.innerHTML = "";

  producto.imagenes.forEach((imagen) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <img src="${imagen.url}" alt="${producto.nombre}" class="w-full h-auto rounded" />
    `;
    swiperWrapper.appendChild(slide);
  });

  // Mostrar modal
  detallesProducto.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Inicializar Swiper (destruir el anterior si ya existía)
  if (window.detalleSwiper) {
    window.detalleSwiper.destroy(true, true);
  }

  window.detalleSwiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
};


const cerrarDetalleProducto = () => {
  detallesProducto.classList.add("hidden");
  document.body.style.overflow = "auto";
};

//EVENTOS
botonCerrar.addEventListener("click", cerrarDetalleProducto);

detallesProducto.addEventListener("click", (e) => {
  if (e.target === detallesProducto) cerrarDetalleProducto();
});

categoriasContainer.addEventListener("click", async (event) => {
  if (event.target && event.target.classList.contains("categoria-btn")) {
    const categoria = event.target.getAttribute("data-categoria");
    const categoriaBtn = document.querySelectorAll(".categoria-btn");

    // Cambiar estilos de activo/inactivo
    categoriaBtn.forEach((btn) => {
      if (btn === event.target) {
        btn.classList.remove("bg-gray-200", "hover:bg-gray-300");
        btn.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
      } else {
        btn.classList.remove("bg-blue-600", "text-white", "hover:bg-blue-700");
        btn.classList.add("bg-gray-200", "hover:bg-gray-300");
      }
    });

    const productos = await obtenerData("productos");
    if (categoria === "todos") {
      mostrarProductos(productos);
    } else {
      const productosFiltrados = productos.filter(
        (producto) => producto.categoria === categoria
      );
      mostrarProductos(productosFiltrados);
    }
  }
});

//HEADER DINÁMICO (TOKEN)
document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("authToken");
  const usuario = sessionStorage.getItem("usuario");

  if (token) {
    navPublico.classList.add("hidden");
    navPrivado.classList.remove("hidden");
    nombreUsuario.textContent = usuario || "Usuario";

    btnLogout.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "./index.html";
    });
  } else {
    navPublico.classList.remove("hidden");
    navPrivado.classList.add("hidden");
  }

  // Inicializar catálogo
  const productos = await obtenerData("productos");
  const categorias = await obtenerData("categorias");
  await mostrarProductos(productos);
  await mostrarBotones(categorias);
});
