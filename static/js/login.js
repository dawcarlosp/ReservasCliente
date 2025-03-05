async function login() {
    const username = document.getElementById("nombreUsuario").value;
    const password = document.getElementById("contrasenia").value;
    try {
        const response = await fetch("http://localhost:8080/auth/login", {
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
let dialogoError = document.getElementById("dialogoError");
let botondialogoError = document.getElementById("cerrarDialogoError");
botondialogoError.addEventListener("click", cerrarMensajeError );
function cerrarMensajeError(){
    dialogoError.className =  "";
    dialogoError.close();
}
function mostrarMensajeError(){
    dialogoError.className =  "border mt-10 p-10 rounded-xl bg-amber-600 flex flex-col items-center justify-center font-mono justify-self-center";
    dialogoError.showModal();
}
async function registro() {
    let username = document.getElementById("nombreUsuario2").value;
    let password = document.getElementById("contrasenia2").value;
    let email = document.getElementById("email2").value;
    let nombre = document.getElementById("nombreCliente2").value;
    try {
        const response = await fetch("http://localhost:8080/auth/register", {
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
            console.error("Error del servidor:", errorData);    
           if(errorData.nombre){
            document.getElementById("spanNombre").textContent = errorData.nombre;
           }
            throw new Error("Error en la autenticación");
        }else{
            alert("Te has registrado correctamente");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
function mostrarDialogoRegistro(){
    let dialogo =  document.getElementById("dialogoRegistro");
    dialogo.className =  "border mt-10 p-10 rounded-xl bg-amber-600 flex flex-col items-center justify-center font-mono justify-self-center";
    dialogo.showModal();
}
function cerrarDialogoRegistro(){
    let dialogo =  document.getElementById("dialogoRegistro");
    dialogo.className =  "";
    dialogo.close();
}
//Mostrar modal
document.getElementById("iniciarSesion").addEventListener("click", login);
document.getElementById("registrarse").addEventListener("click", registro );
document.getElementById("mostrarDialogoRegistro").addEventListener("click", mostrarDialogoRegistro );
document.getElementById("cerrarDialogoRegistro").addEventListener("click", cerrarDialogoRegistro );