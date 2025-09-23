const registroFormulario = document.getElementById("register-form");
const inputUsuario = document.getElementById("username");
const inputClave = document.getElementById("password");
const inputConfirmacionClave = document.getElementById("confirm-password");

//URL PARA LA API
const urlApi = "https://tienda-eyzc.onrender.com";

//Realizar fetch al endponit
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
                alert(data.message);
                if(data.token){
                    sessionStorage.setItem("authToken", data.token);
                    sessionStorage.setItem("usuario", data.nombre);
                    window.location.href = "./ajustes.html";
                }
            } catch (err) {
                console.log(err.message)
            }
        } else {
            alert("Las contraseñas no coinciden");
            inputClave.value = "";
            inputConfirmacionClave.value = "";
        }
    } else {
        alert("Complete con datos validos");
        registroFormulario.reset();
    }

})