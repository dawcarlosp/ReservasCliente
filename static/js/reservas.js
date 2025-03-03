const token = localStorage.getItem("token");
const ip = "localhost";
const puerto = "8080";
let misReservas = [];
let idCliente;
let idMesa;
let reservas;
let mesas;
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
function cerrarSesionF(){// Obtener mesas
    async function obtenerMesas() {
        try {
            const response = await fetch(`http://${ip}:8080/mesas`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 401) {
                throw new Error("Token expirado. Por favor, inicie sesión nuevamente.");
            }
            if (!response.ok) throw new Error("Error al obtener las mesas");
    
            mesas = await response.json();
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    localStorage.removeItem("token");
    location.href = "index.html";
}
cerrarSesion.addEventListener("click", () =>  cerrarSesionF());
// Cargar datos iniciales
(async function iniciarApp() {
    extraccionToken(); 
    await obtenerMisReservas();
    await obtenerMesas();
    mostrarMisReservas();
    //await obtenerMesas();
})();
//Pintar las reservas existentes del cliente logeado
function mostrarMisReservas(){
    let tbody = document.getElementById("tbodyReservas");
    misReservas.forEach(reserva => {
        let tr = document.createElement("tr");
        tr.className = "odd:bg-amber-600 even:bg-amber-400";
        tr.id = reserva.id;
        let id = document.createElement("td");
        id.className = "border px-4 py-2";
        let fecha = document.createElement("td");
        fecha.className = "border px-4 py-2";
        let hora = document.createElement("td");
        hora.className = "border px-4 py-2";
        let comensales = document.createElement("td");
        comensales.className = "border px-4 py-2";
        let mesa = document.createElement("td");
        mesa.className = "border px-4 py-2";
        let operaciones = document.createElement("td");
        operaciones.className = "border px-4 py-2";
        //Contenido
        id.textContent = reserva.id;
        fecha.textContent = reserva.fechaReserva;
        hora.textContent = reserva.horaReserva;
        comensales.textContent = reserva.numeroPersonas;
        mesa.textContent = reserva.mesa.numeroMesa;
        operaciones.innerHTML = `<button class ="border my-5 hover:bg-black hover:text-amber-600 p-2 rounded-xl cursor-pointer hover:scale-110" onclick="borrarReserva(${reserva.id},this)">Borrar</button>`;
        tr.appendChild(id);
        tr.appendChild(fecha);
        tr.appendChild(hora);
        tr.appendChild(comensales);
        tr.appendChild(mesa);
        tr.appendChild(operaciones);
        tbody.appendChild(tr);
    });
}
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
        misReservas = reservas.filter(reserva => reserva.cliente.id == idCliente);
        console.log("Mis reservas");
        console.log(misReservas)
    } catch (error) {
        console.error("Error:", error);
    }
}
// Obtener mesas
async function obtenerMesas() {
    try {
        const response = await fetch(`http://${ip}:${puerto}/mesas`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            throw new Error("Token expirado. Por favor, inicie sesión nuevamente.");
        }
        if (!response.ok) throw new Error("Error al obtener las mesas");

        mesas = await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

//funcion para borrar la reserva
async function borrarReserva(id, elemento){
    if(confirm("¿Estas seguro de qué deseas borrar esta reserva?")){
try {
    const response = await fetch(`http://${ip}:${puerto}/reservas/${id}`,{method: 'DELETE', headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }});
    if(!response.ok)
    {
        throw new Error("Error al borrar el proyecto")
    }
    elemento.parentNode.parentNode.remove();
}catch (error){
    console.error("Error:", error);
}}}
// Dialogo Nueva Reserva
let dialogo =  document.getElementById("dialogoReservaNueva");
let botonReservaNueva = document.getElementById("botonDialogoReserva");
let botonCerrarDialogo = document.getElementById("cerrarDialogoReserva");
botonCerrarDialogo.addEventListener("click",cerrarDialogoReserva);
botonReservaNueva.addEventListener("click", mostrarDialogoReserva );
function mostrarDialogoReserva(){
    dialogo.className =  "border mt-10 p-10 rounded-xl bg-amber-600 flex flex-col items-center justify-center font-mono justify-self-center";
    dialogo.showModal();
}
//Cerrar ventana de nueva reserva
function cerrarDialogoReserva(){
    dialogo.className =  "";
    dialogo.close();
}
//fecha y hora
let fechaReserva;
let horaReserva;
let fechaReservaInput = document.getElementById("fechaReserva");
let horaReservaInput = document.getElementById("horaReserva");
//Cuando se programo el back, la fecha se designo con el formato d-m-y
fechaReservaInput.addEventListener("change", () => fechaReservaF(fechaReservaInput.value.split("-").reverse().join("-")));
horaReservaInput.addEventListener("change", () => horaReservaF(horaReservaInput.value));
function horaReservaF(valor){
    horaReserva = valor;
    if(horaReserva && fechaReserva){
    changeFechaHora();
    }
}
function fechaReservaF(valor){
    fechaReserva = valor;
    if(horaReserva && fechaReserva){
    changeFechaHora();
    }
}
//Traer reservas
function changeFechaHora(){
    //reservas de una fecha y hora concreta
    let resevasDiaHora = reservas.filter(reserva => reserva.horaReserva == horaReserva && reserva.fechaReserva == fechaReserva);
    //ids de las mesas que estan ocupadas en una fecha y hora concretas
    let mesasOcupadas = resevasDiaHora.map(reserva => reserva.mesa.id);
    //Dibujamos las mesas
    let mesasUI = document.querySelectorAll(".mesa");
    if (mesasUI.length === 0) {
        // Si las mesas aún no han sido creadas, créalas una sola vez
        mesas.forEach(mesa => {
            let div = document.createElement("div");
            div.textContent = "Mesa " + mesa.numeroMesa;
            div.className = "mesa rounded-3xl bg-black text-amber-600 w-20 h-20 flex justify-center items-center hover:scale-110 my-1 cursor-pointer";
            
            div.dataset.id = mesa.id; // Para identificar cada mesa
            div.addEventListener("click", () => {
                alert(`Has seleccionado la mesa ${mesa.numeroMesa}`);
                idMesa = mesa.numeroMesa;
                pintarInputNumerico();
            });

            dialogo.appendChild(div);
        });
    } 
    // Solo cambiar visibilidad de las mesas en lugar de recrearlas
    document.querySelectorAll(".mesa").forEach(mesa => {
        let idMesa = parseInt(mesa.dataset.id);
        if (mesasOcupadas.includes(idMesa)) {
            mesa.style.display = "none"; // Ocultar si está ocupada
        } else {
            mesa.style.display = "flex"; // Mostrar si está disponible
        }
    });
}
//Input de los comensales
function pintarInputNumerico(){
    let input = document.getElementById("inputNumero");
    if (!input) {
        input = document.createElement("input");
        input.id = "inputNumero";
        input.type = "number";
        input.className = "border";
        input.min = 1;
        input.max = 20;
        input.step = 1;
        input.value = 1;

        let label = document.createElement("label");
        label.id = "labelNumero";
        label.textContent = "Vamos a ser(comensales): ";
        dialogo.appendChild(label);
        dialogo.appendChild(input);

        input.addEventListener("change", inyeccionboton);
    }
}
//boton de reserva;
function inyeccionboton(){
    //Asignar el valor
    numeroPersonas = document.getElementById("inputNumero").value;
    let boton = document.getElementById("boton");
    if(boton) boton.remove();
    boton = document.createElement("button");
    boton.id = "boton";
    boton.className ="border rounded-xl mt-3 hover:bg-black hover:text-amber-600 p-1 cursor-pointer hover:scale-110";
    boton.textContent = "Reservar";
    //boton.addEventListener("click", reservar);
    dialogo.appendChild(boton);
}


//Pijeria para que el dialogo se pueda mover
let isDragging = false;
let offsetX, offsetY;
dialogo.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - dialogo.offsetLeft;
    offsetY = e.clientY - dialogo.offsetTop;
    dialogo.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        dialogo.style.left = `${e.clientX - offsetX}px`;
        dialogo.style.top = `${e.clientY - offsetY}px`;
        dialogo.style.position = "absolute"; // Para moverlo
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    dialogo.style.cursor = "default";
});