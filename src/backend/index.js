//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

// Apartado de la validación de credenciales.
app.post('/usuario', function(req, res) {
    // Imprimo los datos enviados desde el frontend para asegurarme que llegan correctamente
    console.log(req.body);

    //Verifico si recibo las credenciales desde el frontend
    if (req.body.name !== undefined && req.body.password !== undefined) {
        // Mostrar mensaje en la consola del servidor
        console.log(` - Server Backend: Credenciales recibidas: Nombre de usuario: ${req.body.name}, Contraseña: ${req.body.password}`);
        
        // Responder al frontend con un mensaje de confirmación
        res.status(200).send(' - Server Backend: Credenciales recibidas correctamente');
    } else {
        // Si no se recibe correctamente las credenciales, responder con un mensaje de error
        res.status(400).send(' - Server Backend: Credenciales inválidas o incompletas');
    }
});


app.get('/devices/', function(req, res, next) {
    devices = [
        { 
            'id': 1, 
            'name': 'Lampara 1', 
            'description': 'Luz living', 
            'state': 0, 
            'type': 1, 
        },
        { 
            'id': 2, 
            'name': 'Ventilador 1', 
            'description': 'Ventilador Habitacion', 
            'state': 1, 
            'type': 2, 
        },
        { 
            'id': 3, 
            'name': 'Aspiradora 1', 
            'description': 'Aspiradora IoT', 
            'state': 1, 
            'type': 2, 
        },
        { 
            'id': 4, 
            'name': 'ESP32 C3 1', 
            'description': 'Microcontrolador ESP32 C3', 
            'state': 0, 
            'type': 2, 
        },
        { 
            'id': 5, 
            'name': 'Cafetera 1', 
            'description': 'Cafetera cocina', 
            'state': 1, 
            'type': 2, 
        },
    ]
    res.send(JSON.stringify(devices)).status(200);
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
