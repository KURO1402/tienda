const registroFormulario = document.getElementById("register-form");
const inputUsuario = document.getElementById("username");
const inputClave = document.getElementById("password");
const inputConfirmacionClave = document.getElementById("confirm-password");

//URL PARA LA API
const urlApi = "https://tienda-eyzc.onrender.com/api";

//Realizar fetch al endpoint
registroFormulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = inputUsuario.value.trim();
    const clave = inputClave.value.trim();
    const confirmacion = inputConfirmacionClave.value.trim();

    if(usuario && clave && confirmacion && usuario.length > 0 && clave.length > 0 && confirmacion.length > 0){
        if(clave === confirmacion){
            try {
                const response = await fetch(`${urlApi}/usuarios/registro`, {
                    method: "POST",
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({usuario: usuario, password: clave })
                });
                const data = await response.json();
                
                if(data.token){
                    await Swal.fire({
                        icon: 'success',
                        title: '¡Registro exitoso!',
                        text: 'Cuenta creada correctamente',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    sessionStorage.setItem("authToken", data.token);
                    sessionStorage.setItem("usuario", data.nombre);
                    window.location.href = "./ajustes.html";
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error en registro',
                        text: data.message || 'No se pudo crear la cuenta'
                    });
                }
            } catch (err) {
                console.log(err.message);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor'
                });
            }
        } else {
            await Swal.fire({
                icon: 'warning',
                title: 'Contraseñas no coinciden',
                text: 'Las contraseñas deben ser iguales'
            });
            inputClave.value = "";
            inputConfirmacionClave.value = "";
        }
    } else {
        await Swal.fire({
            icon: 'warning',
            title: 'Datos incompletos',
            text: 'Completa todos los campos'
        });
        registroFormulario.reset();
    }
});