const loginForm = document.getElementById("login-form");
const inputUsuario = document.getElementById("usuario");
const inputClave = document.getElementById("password");

//URL PARA LA API
const urlApi = "https://tienda-eyzc.onrender.com";

//Realizar fetch al endpoint
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = inputUsuario.value.trim();
    const clave = inputClave.value.trim();
    
    try {
        if(usuario && clave && usuario.length > 0 && clave.length > 0 ){
            const response = await fetch(`${urlApi}/usuarios/login`, {
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
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                sessionStorage.setItem("authToken", data.token);
                sessionStorage.setItem("usuario", data.nombre);
                window.location.href = "./ajustes.html";
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Credenciales incorrectas'
                });
            }
        } else {
            await Swal.fire({
                icon: 'warning',
                title: 'Datos incompletos',
                text: 'Por favor ingresa usuario y contraseña'
            });
            loginForm.reset();
        }
        
    } catch (error) {
        console.log(error.message);
        await Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor'
        });
    }
});