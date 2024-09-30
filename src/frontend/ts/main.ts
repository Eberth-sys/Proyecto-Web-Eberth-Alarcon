class Main implements EventListenerObject {
    private users: Array<Usuario> = new Array();

    constructor() {
        // Vinculación del botón 'Ingresar' con el evento de clic
        let btnLogin = this.recuperarElemento("btnLogin");
        btnLogin.addEventListener('click', this);

        // Vinculación del botón 'Buscar Dispositivos' con el evento de clic
        let btnBuscar = this.recuperarElemento("btnBuscar");
        btnBuscar.addEventListener('click', this);
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
                console.log(usuario, checkbox.checked);

                iUser.disabled = true;
                iPass.disabled = true;
                (<HTMLInputElement>object.target).disabled = true;

                let divLogin = this.recuperarElemento("divLogin");
                divLogin.hidden = true;
            } else {
                alert("El nombre de usuario debe tener al menos 4 caracteres y la contraseña al menos 6 caracteres.");
            }
        }

        // Búsqueda de dispositivos
        else if (idDelElemento === 'btnBuscar') {
            console.log("Buscando Dispotivos!");
            this.buscarDevices();
        }
        
    }

    // Función para buscar y mostrar dispositivos
    private buscarDevices(): void {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    let ul = this.recuperarElemento("list");

                    if (ul) { // Asegurarse de que el elemento 'list' existe
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
        console.log(`Dispositivo ID: ${idDispositivo} cambiado a: ${nuevoEstado ? 'On' : 'Off'}`);
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

