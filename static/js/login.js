const ip = "192.168.21.159";
const puerto = "8080";
async function login() {
    const username = document.getElementById("nombreUsuario").value;
    const password = document.getElementById("contrasenia").value;
    try {
        const response = await fetch(`http://${ip}:${puerto}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            //alert("Usuario e passwords incorrectos");
            mostrarMensajeError();
            throw new Error("Error en la autenticación");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token); 
        window.location.href = "reservas.html";
    } catch (error) {
        console.error("Error:", error);
    }
}
//Dialogo de error de login
let dialogoError = document.getElementById("dialogoError");
let botondialogoError = document.getElementById("cerrarDialogoError");
botondialogoError.addEventListener("click", cerrarMensajeError );
function cerrarMensajeError(){
    dialogoError.className =  "";
    dialogoError.close();
}
function mostrarMensajeError(){
    dialogoError.className =  "border mt-10 p-10 rounded-xl bg-indigo-500 text-zinc-900 flex flex-col items-center justify-center font-mono self-center justify-self-center";
    dialogoError.showModal();
}
//Dialogo de exito de nuevo usuario
let dialogoExitoLogin = document.getElementById("dialogoExitoLogin");
let botondialogoExitoLogin = document.getElementById("cerrarDialogoExito");
botondialogoExitoLogin.addEventListener("click", cerrarMensajeExitoLogin);
function cerrarMensajeExitoLogin(){
    dialogoExitoLogin.className =  "";
    dialogoExitoLogin.close();
}
function mostrarMensajeExito(){
    dialogoExitoLogin.className =  "border mt-10 p-10 rounded-xl bg-zinc-900 text-white flex flex-col items-center justify-center font-mono justify-self-center self-center";
    dialogoExitoLogin.showModal();
}
async function registro() {
    let username = document.getElementById("nombreUsuario2").value;
    let password = document.getElementById("contrasenia2").value;
    let email = document.getElementById("email2").value;
    let nombre = document.getElementById("nombreCliente2").value;
    try {
        const response = await fetch(`http://${ip}:${puerto}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, email,nombre })       
        });
        document.getElementById("nombreUsuario2").value="";
        document.getElementById("contrasenia2").value="";
        document.getElementById("email2").value="";
        document.getElementById("nombreCliente2").value="";
        if (!response.ok) {
            const errorData = await response.json(); // Obtener detalles del error del backend
           if(errorData.nombre){
            document.getElementById("spanNombre").textContent = errorData.nombre;
           }
           if(errorData.email){
            document.getElementById("spanEmail").textContent = errorData.email;
           }
           if(errorData.username){
            document.getElementById("spanNombreUsuario").textContent = errorData.username;
           }
           if(errorData.password){
            document.getElementById("spanContrasenia").textContent = errorData.password;
           }
            throw new Error("Error en la autenticación");
        }else{
            mostrarMensajeExito();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
function mostrarDialogoRegistro(){
    let dialogo =  document.getElementById("dialogoRegistro");
    dialogo.className =  "border mt-10 p-10 rounded-xl bg-zinc-800 text-white flex flex-col items-center justify-center font-sans justify-self-center self-center";
    dialogo.showModal();
}
function cerrarDialogoRegistro(){
    let dialogo =  document.getElementById("dialogoRegistro");
        document.getElementById("spanNombre").textContent = "";
        document.getElementById("spanEmail").textContent = "";
        document.getElementById("spanNombreUsuario").textContent = "";
        document.getElementById("spanContrasenia").textContent = "";

    dialogo.className =  "";
    dialogo.close();
}
//Mostrar modal
document.getElementById("iniciarSesion").addEventListener("click", login);
document.getElementById("registrarse").addEventListener("click", registro );
document.getElementById("mostrarDialogoRegistro").addEventListener("click", mostrarDialogoRegistro );
document.getElementById("cerrarDialogoRegistro").addEventListener("click", cerrarDialogoRegistro );