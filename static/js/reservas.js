const token = localStorage.getItem("token");
const ip = "localhost";
const puerto = "8080";
let misReservas = [];
let idCliente;
//Verifica si hay token o no 
if (!token) {
    location.href = "index.html";
    throw new Error("No hay token, inicia sesión.");
}
//Decodificar el token
function extraccionToken(){
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(window.atob(base64));
    console.log(decodedToken)
    idCliente = decodedToken.sub;
}
//Cerrar sesion
let cerrarSesion = document.getElementById("cerrarSesion");
function cerrarSesionF(){
    localStorage.removeItem("token");
    location.href = "index.html";
}
cerrarSesion.addEventListener("click", () =>  cerrarSesionF());
// Cargar datos iniciales
(async function iniciarApp() {
    extraccionToken(); 
    await obtenerMisReservas();
    //await obtenerMesas();
})();
// Obtener reservas
async function obtenerMisReservas() {
    try {
        //Para probarlo desde el movil
        const response = await fetch(`http://${ip}:${puerto}/reservas`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            throw new Error("Token expirado. Por favor, inicie sesión nuevamente.");
        }
        if (!response.ok) throw new Error("Error al obtener las reservas");
        reservas = await response.json();
        console.log(reservas)
        misReservas = reservas.filter(reserva => reserva.cliente.id = idCliente);
        //console.log(misReservas)
    } catch (error) {
        console.error("Error:", error);
    }
}
