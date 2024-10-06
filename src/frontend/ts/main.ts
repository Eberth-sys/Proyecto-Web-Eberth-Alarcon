class Main implements EventListenerObject {
    private users: Array<Usuario> = new Array();

    constructor() {
        // Vinculación del botón 'Ingresar' con el evento de clic
        let btnLogin = this.recuperarElemento("btnLogin");
        btnLogin.addEventListener('click', this);

        // Vinculación del botón 'Buscar Dispositivos' con el evento de clic
        let btnBuscar = this.recuperarElemento("btnBuscar");
        btnBuscar.addEventListener('click', this);

        // Vinculación del botón 'Agregar Nuevo Dispositivo +' con el evento de clic
        let btnAgregarDispositivo = this.recuperarElemento("btnAgregarDispositivo");
        btnAgregarDispositivo.addEventListener('click', this); // <-- Asegurarse de vincular el botón aquí
    }

    handleEvent(object: Event): void {
        let idDelElemento = (<HTMLElement>object.target).id;

        // Validación del formulario de login
        if (idDelElemento === 'btnLogin') {
            console.log("login");

            let iUser = this.recuperarElemento("userName");
            let iPass = this.recuperarElemento("userPass");
            let usuarioNombre: string = iUser.value;
            let usuarioPassword: string = iPass.value;

            if (usuarioNombre.length >= 4 && usuarioPassword.length >= 6) {
                console.log("Voy al servidor... ejecuto consulta");
                let usuario: Usuario = new Usuario(usuarioNombre, usuarioPassword);

                let checkbox = this.recuperarElemento("cbRecor");
                console.log(usuario, checkbox.checked); // Muestro en pantalla las credenciales y el estado booleno del boton checked.

                iUser.disabled = true;
                iPass.disabled = true;
                (<HTMLInputElement>object.target).disabled = true;

                let divLogin = this.recuperarElemento("divLogin");
                divLogin.hidden = true;

                // Enviar las credenciales al servidor Backend
                let data = JSON.stringify({ name: usuarioNombre, password: usuarioPassword });

                // Realizar la solicitud POST al servidor
                let xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", "http://localhost:8000/usuario/", true);  
                xmlHttp.setRequestHeader("Content-Type", "application/json");
                xmlHttp.onreadystatechange = () => {
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        console.log("Credenciales enviadas y validadas en el servidor Backend");
                    } else if (xmlHttp.readyState === 4) {
                        console.log("Error en la validación de credenciales. Código de estado: ", xmlHttp.status);
                    }
                };
                xmlHttp.send(data);

            } else {
                console.log("El nombre de usuario debe tener al menos 4 caracteres y la contraseña al menos 6 caracteres.");
                alert("El nombre de usuario debe tener al menos 4 caracteres y la contraseña al menos 6 caracteres.");
            }
        }

        // Búsqueda de dispositivos
        else if (idDelElemento === 'btnBuscar') {
            console.log("Buscando Dispotivos!");
            this.buscarDevices();
        }

        // Boton para Agregar nuevo dispositivo
        else if (idDelElemento === 'btnAgregarDispositivo') {
            console.log("Agregar un nuevo dispositivo");
            // Muestro mensaje para agregar un dispotivo
            alert("Agregar dispositivo");
        }
        
    }

    // Función para buscar y mostrar dispositivos
    private buscarDevices(): void {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    let ul = this.recuperarElemento("list");

                    if (ul) { // elemento 'list' existe
                        let listaDevices: string = '';
                        let lista: Array<Device> = JSON.parse(xmlHttp.responseText);

                        for (let item of lista) {
                            listaDevices += `<li class="collection-item avatar">
                                <img src="./static/images/1421.png" alt="" class="circle">
                                <span class="title">${item.name}</span>
                                <p>${item.description}</p>
                                <a href="#!" class="secondary-content">
                                    <div class="switch">
                                        <label>
                                            Off
                                            <input type="checkbox" ${item.state ? 'checked' : ''} data-id="${item.id}" onchange="main.cambiarEstadoDispositivo(event)">
                                            <span class="lever"></span>
                                            On
                                        </label>
                                    </div>
                                </a>
                                <div class="center-align">
                                <button class="btn-small waves-effect waves-light" data-id="${item.id}" onclick="main.editarDispositivo(event)">Editar</button>
                                <!-- Botón de Eliminar -->
                                <button class="btn-small red waves-effect waves-light" onclick="main.eliminarDispositivo(${item.id}, '${item.name}')">Eliminar</button>
                                </div>
                            </li>`;
                        }
                        ul.innerHTML = listaDevices;
                    } else {
                        alert("No se encontró el contenedor de la lista de dispositivos.");
                    }
                } else {
                    alert("ERROR en la consulta de dispositivos.");
                }
            }
        }

        xmlHttp.open("GET", "http://localhost:8000/devices", true);
        xmlHttp.send(); 
    }

    public cambiarEstadoDispositivo(event: Event): void {
        let checkbox = <HTMLInputElement>event.target;
        let idDispositivo = checkbox.getAttribute('data-id');
        let nuevoEstado = checkbox.checked;
   
        // Mostrar en consola el ID del dispositivo y su nuevo estado (true o false)
        console.log(`Dispositivo ID: ${idDispositivo} cambiado a: ${nuevoEstado ? 'On' : 'Off'} :${nuevoEstado} `);

        // Envio el nuevo estado del dispositivo al servidor Backend
        let data = JSON.stringify({ id: idDispositivo, state: nuevoEstado });

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", "http://localhost:8000/updateDeviceState", true); // Llamo la funcion del backend
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                console.log("Estado del dispositivo actualizado en el servidor");
            } else if (xmlHttp.readyState === 4) {
                console.log("Error al actualizar el estado del dispositivo");
            }
        };
        xmlHttp.send(data); // Envío el ID y el estado actualizado al backend
    }

   
     public editarDispositivo(event: Event): void {
        let boton = <HTMLButtonElement>event.target;
        let idDispositivo = boton.getAttribute('data-id');

        // Mostrar mensaje para editar el dispositivo
        console.log(`Editar Dispositivo ID: ${idDispositivo}`);
        let nuevoNombre = prompt("Editar Nombre del dispositivo:");
        let nuevaDescripcion = prompt("Editar Descripción del dispositivo:");
        let nuevoTipo = prompt("Editar Tipo de dispositivo:");

        if (nuevoNombre && nuevaDescripcion && nuevoTipo) {
            // Crear el cuerpo de la solicitud
            let data = JSON.stringify({
                id: idDispositivo,
                name: nuevoNombre,
                description: nuevaDescripcion,
                type: parseInt(nuevoTipo)
            });

            // Envío la solicitud PUT al backend
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open("PUT", "http://localhost:8000/editDevice", true);
            xmlHttp.setRequestHeader("Content-Type", "application/json");
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    console.log("Dispositivo actualizado en el servidor");
                } else if (xmlHttp.readyState === 4) {
                    console.log("Error al actualizar el dispositivo");
                }
            };
            xmlHttp.send(data); // Enviar los nuevos datos al backend
        } else {
            alert("Todos los campos deben ser completados.");
        }
    }

    public eliminarDispositivo(idDispositivo: number, nombreDispositivo: string): void {
        console.log(`Dispositivo ID: ${idDispositivo} con nombre [${nombreDispositivo}] será eliminado.`);
        // Mensaje de alerta que sera eliminado
        alert(`El Dispositivo ID: ${idDispositivo} con nombre [${nombreDispositivo}] será eliminado.`);
    }
    

    // Método para recuperar un elemento HTML por su ID
    private recuperarElemento(id: string): HTMLInputElement {
        return <HTMLInputElement>document.getElementById(id);
    }
}

// Inicialización de la clase cuando la página carga.

let main: Main; // Declaro la variable 'main' fuera del 'load' para que sea accesible por el estado de los dispositivos.

window.addEventListener('load', () => {
    main = new Main(); // Asigno la instancia de 'Main' a 'main'
});