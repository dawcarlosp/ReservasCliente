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
            alert("Usuario e passwords incorrectos");
            throw new Error("Error en la autenticación");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token); 
        window.location.href = "reservas.html";
    } catch (error) {
        console.error("Error:", error);
    }
}
async function registro() {
    const username = document.getElementById("nombreUsuario2").value;
    const password = document.getElementById("contrasenia2").value;
    const email = document.getElementById("email2").value;
    try {
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, email })
        });

        if (!response.ok) {
            alert("No se ha podido registrar");
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