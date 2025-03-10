const token = localStorage.getItem("token");
const ip = "localhost";
const puerto = "8080";
let misReservas = [];
let idCliente;
let idMesa;
let reservas;
let mesas;
let horaReserva;
let fechaReserva;

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
    idCliente = decodedToken.sub;
    document.getElementById("bienvenida").textContent = "¡Bienvenido " + decodedToken.username + "!";
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
    await obtenerMesas();
    mostrarMisReservas();
})();
//Pintar las reservas existentes del cliente logeado
function mostrarMisReservas(){
    let tbody = document.getElementById("tbodyReservas");
    if(misReservas.length == 0){
        let p = document.createElement("p");
        p.textContent = "No tienes ninguna reserva aun";
        document.getElementById("mensajeVacio").appendChild(p);
    }else{
        document.getElementById("mensajeVacio").innerHTML="";
    }
    misReservas.forEach(reserva => {
        let tr = document.createElement("tr");
        tr.className = "odd:bg-zinc-900 even:bg-zinc-800";
        tr.id = reserva.id;
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

        fecha.textContent = reserva.fechaReserva;
        hora.textContent = reserva.horaReserva;
        comensales.textContent = reserva.numeroPersonas;
        mesa.textContent = reserva.mesa.numeroMesa;
        operaciones.innerHTML = `<button class ="border my-5 hover:text-indigo-500 p-2 rounded-xl cursor-pointer hover:scale-110" onclick="borrarReserva(${reserva.id},this)">Borrar</button>`;
        tr.appendChild(fecha);
        tr.appendChild(hora);
        tr.appendChild(comensales);
        tr.appendChild(mesa);
        tr.appendChild(operaciones);
        tbody.appendChild(tr);
    });
}
//Pintar nueva reserva;
function mostrarReservaInsertada(reserva){
    let tbody = document.getElementById("tbodyReservas");
        let tr = document.createElement("tr");
        tr.className = "odd:bg-zinc-900 even:bg-zinc-800";
        tr.id = reserva.id;
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
        fecha.textContent = reserva.fechaReserva;
        hora.textContent = reserva.horaReserva;
        comensales.textContent = reserva.numeroPersonas;
        mesa.textContent = reserva.mesa.numeroMesa;
        operaciones.innerHTML = `<button class ="border my-5 hover:text-indigo-500 p-2 rounded-xl cursor-pointer hover:scale-110" onclick="borrarReserva(${reserva.id},this)">Borrar</button>`;
        tr.appendChild(fecha);
        tr.appendChild(hora);
        tr.appendChild(comensales);
        tr.appendChild(mesa);
        tr.appendChild(operaciones);
        tbody.appendChild(tr);
        document.getElementById("mensajeVacio").innerHTML="";
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
        throw new Error("Error al borrar la reserva")
    }
    const index = misReservas.findIndex(reserva => reserva.id === id);
            if (index !== -1) {
                misReservas.splice(index, 1); // Eliminar del array
            }
    elemento.parentNode.parentNode.remove();
    if(misReservas.length == 0){
        document.getElementById("mensajeVacio").innerHTML="";
        let p = document.createElement("p");
        p.textContent = "No tienes ninguna reserva aun";
        document.getElementById("mensajeVacio").appendChild(p);
    }
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
    dialogo.className =  "border mt-10 p-10 rounded-xl bg-zinc-900 text-white flex flex-col items-center justify-center font-mono justify-self-center";
    dialogo.showModal();
}
//Cerrar ventana de nueva reserva
function cerrarDialogoReserva(){
    dialogo.className =  "";
    document.getElementById("spanFechaReserva").textContent = "";
    dialogo.close();
}
//fecha y hora
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
    let fechaIngresada = new Date(); 
    fechaIngresada.setDate(valor.split("-")[0]);
    fechaIngresada.setMonth(valor.split("-")[1]-1);
    fechaIngresada.setFullYear(valor.split("-")[2]);
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    if (fechaIngresada < manana) {
        document.getElementById("spanFechaReserva").textContent = "Solo hacemos reservas con un día de antelación con el objetivo de ofrecerle el mejor servicio";
    }else{
        document.getElementById("spanFechaReserva").textContent = "";
    }
    fechaReserva = valor;
    if(horaReserva && fechaReserva){
    changeFechaHora();
    }
}
//Traer reservas
function changeFechaHora() {
    let resevasDiaHora = reservas.filter(reserva => reserva.horaReserva == horaReserva && reserva.fechaReserva == fechaReserva);
    let mesasOcupadas = resevasDiaHora.map(reserva => reserva.mesa.id);
    
    let mesasUI = document.querySelectorAll(".mesa");
    if (mesasOcupadas.length > 0 && mesasOcupadas.length === mesas.length) {
        alert("Todas las mesas están ocupadas para esta fecha y esta hora, por favor pruebe con otra.");
    }

    if (mesasUI.length === 0) {
        mesas.forEach(mesa => {
            let div = document.createElement("div");
            div.textContent = "Mesa " + mesa.numeroMesa;
            div.className = "mesa rounded-3xl bg-zinc-800 text-indigo-500 w-20 h-20 flex justify-center items-center hover:scale-110 my-1 cursor-pointer";
            div.dataset.id = mesa.id; 

            div.addEventListener("click", () => {
                // Resetear todas las mesas antes de aplicar el nuevo estilo
                document.querySelectorAll(".mesa").forEach(m => {
                    m.className = "mesa rounded-3xl bg-zinc-800 text-indigo-500 w-20 h-20 flex justify-center items-center hover:scale-110 my-1 cursor-pointer";
                });

                div.className = "mesa rounded-3xl bg-indigo-500 text-zinc-900 border-5 w-20 h-20 flex justify-center items-center hover:scale-110 my-1 cursor-pointer";
                
                idMesa = mesa.id;
                pintarInputNumerico();
            });

            dialogo.appendChild(div);
        });
    }

    // Resetear visibilidad de todas las mesas
    document.querySelectorAll(".mesa").forEach(mesa => {
        let idMesa = parseInt(mesa.dataset.id);
        if (mesasOcupadas.includes(idMesa)) {
            mesa.style.display = "none"; 
        } else {
            mesa.style.display = "flex"; // Asegurar que se muestre si ya no está ocupada
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
    boton.className ="border rounded-xl mt-3 hover:text-indigo-500 p-1 cursor-pointer hover:scale-110";
    boton.textContent = "Reservar";
    boton.addEventListener("click", reservar);
    dialogo.appendChild(boton);
}

//funcion para hacer el post de la reserva
//Reservar 
async function reservar(){
    idCliente = parseInt(idCliente);
    numeroPersonas = parseInt(numeroPersonas);
    const reserva= {idMesa, idCliente, fechaReserva, horaReserva, numeroPersonas};

    try{
        const response = await fetch(`http://${ip}:${puerto}/reservas`,
            {
                method: 'POST',
                headers:{
                    "Authorization": `Bearer ${token}`,
                    'content-Type':'application/json'
                },
                body: JSON.stringify(reserva)
            })
        if(!response.ok)
        {
            const errorData = await response.json(); // Obtener detalles del error del backend
            if(errorData[0].field){
             document.getElementById("spanFechaReserva").textContent = errorData[0].message;
              //Apaño sucio para eliminar los inputs inyectamos mediante js para que el usuario no le pueda dar al boton otra ves
        document.getElementById("boton").remove();
        document.getElementById("inputNumero").remove();
        document.getElementById("labelNumero").remove();
        document.querySelectorAll(".mesa").forEach(mesa => mesa.remove());
        //Limpiar los valores de los dos inputs que siempre estan presente
        document.getElementById("fechaReserva").value = "";
        document.getElementById("horaReserva").value = "";
        document.getElementById("mensajeVacio").innerHTML="";
            }
            console.error("Error del servidor:", errorData);
            throw new Error(errorData.mensaje || "Error al insertar la reserva"); // Muestra el mensaje real
        }
        //Capturo la respuesta para coger el id
        const reservaInsertada = await response.json();
        mostrarReservaInsertada(reservaInsertada);
        mostrarMensajeExito(reservaInsertada);
        //Apaño sucio para eliminar los inputs inyectamos mediante js para que el usuario no le pueda dar al boton otra ves
        document.getElementById("boton").remove();
        document.getElementById("inputNumero").remove();
        document.getElementById("labelNumero").remove();
        document.querySelectorAll(".mesa").forEach(mesa => mesa.remove());
        //Limpiar los valores de los dos inputs que siempre estan presente
        document.getElementById("fechaReserva").value = "";
        document.getElementById("horaReserva").value = "";
}catch (error){
    console.error(error);
}
}
//Mensaje de reserva insertada
let dialogoExitoR = document.getElementById("dialogoExitoReserva");

function cerrarMensajeExito(){
    dialogoExitoR.className =  "";
    dialogoExitoR.close();
}
function mostrarMensajeExito(reserva){
    dialogoExitoR.className =  "border mt-10 p-10 rounded-xl bg-zinc-900 text-white flex flex-col items-center justify-center font-mono justify-self-center";
    dialogoExitoR.innerHTML = "";
    let b = document.createElement("b");
    let button = document.createElement("button");
    button.textContent = "Estupendo!";
    button.id = "cerrarDialogoExitoR";
    button.className = "border hover:text-indigo-500 p-2 mt-2 rounded-xl cursor-pointer hover:scale-110";
    button.addEventListener("click", cerrarMensajeExito);
    b.textContent = `¡Enhorabuena! Tienes una nueva reserva, el dia ${reserva.fechaReserva}, a las ${reserva.horaReserva} para ${reserva.numeroPersonas} personas`;
    dialogoExitoR.appendChild(b);
    dialogoExitoR.appendChild(button);
    dialogoExitoR.showModal();
}




//Pijeria para que el dialogo se pueda mover, le podría interesar para ver sus reservas
/*
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
});*/

