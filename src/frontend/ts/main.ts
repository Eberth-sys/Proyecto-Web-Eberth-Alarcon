class Main implements EventListenerObject {
    private users: Array<Usuario> = new Array();

    constructor() {

        // Vinculación del botón 'Ingresar' con el evento de clic
        let btnLogin = this.recuperarElemento("btnLogin");
        btnLogin.addEventListener('click', this);
    }

    handleEvent(object: Event): void {
        let idDelElemento = (<HTMLElement>object.target).id;
        
        if (idDelElemento === 'btnLogin') {
            console.log("login");

            // Recuperar valores del input de usuario y contraseña
            let iUser = this.recuperarElemento("userName");
            let iPass = this.recuperarElemento("userPass");
            let usuarioNombre: string = iUser.value;
            let usuarioPassword: string = iPass.value;
            
            // Validación del usuario y contraseña
            if (usuarioNombre.length >= 4 && usuarioPassword.length >= 6) {
                console.log("Voy al servidor... ejecuto consulta");

                // Crear un objeto Usuario para simulación
                let usuario: Usuario = new Usuario(usuarioNombre, usuarioPassword);

                // Validación del checkbox "Recordarme"
                let checkbox = this.recuperarElemento("cbRecor");
                console.log(usuario, checkbox.checked);

                // Desactivar los campos de usuario y contraseña tras la validación
                iUser.disabled = true;
                iPass.disabled = true;
                (<HTMLInputElement>object.target).disabled = true;

                // Esconder el formulario de login (opcional)
                let divLogin = this.recuperarElemento("divLogin");
                divLogin.hidden = true;
            } else {
                // Mensaje de error si no cumple con las validaciones
                alert("El nombre de usuario debe tener al menos 4 caracteres y la contraseña al menos 6 caracteres.");
            }
        }
    }

    // Método para recuperar un elemento HTML por su ID
    private recuperarElemento(id: string): HTMLInputElement {
        return <HTMLInputElement>document.getElementById(id);
    }
}

// Inicialización de la clase cuando la página carga
window.addEventListener('load', () => {
    let main: Main = new Main();
});
