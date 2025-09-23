const loginForm = document.getElementById("login-form");
const inputUsuario = document.getElementById("usuario");
const inputClave = document.getElementById("password");

//URL PARA LA API
const urlApi = "https://tienda-eyzc.onrender.com";

//Realizar fetch al endponit
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
            alert(data.message);
            if(data.token){
                sessionStorage.setItem("authToken", data.token);
                sessionStorage.setItem("usuario", data.nombre);
                window.location.href = "./ajustes.html";
            }
        } else {
            alert("Coloca datos validos");
            loginForm.reset();
        }
        
    } catch (error) {
        console.log(error.message)
    }
})