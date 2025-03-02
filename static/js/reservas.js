const token = localStorage.getItem("token");
const ip = "localhost";
const puerto = "8080";
//Verifica si hay token o no 
if (!token) {
    location.href = "index.html";
    throw new Error("No hay token, inicia sesión.");
}
let cerrarSesion = document.getElementById("cerrarSesion");
function cerrarSesionF(){
    localStorage.removeItem("token");
    location.href = "index.html";
}
cerrarSesion.addEventListener("click", () =>  cerrarSesionF());