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

// Apartado de la [ Validación de credenciales ].
app.post('/usuario', function(req, res) {
    // Imprimo los datos enviados desde el frontend para asegurarme que llegan correctamente
    console.log("Credenciales", req.body);

    //Verifico las credenciales recibidas desde el frontend
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

// Apartado de la [ BUSCAR LOS DISPOTIVOS. ].

// Obtener la lista de dispositivos desde la base de datos
app.get('/devices/', (req, res) => {
    utils.query('SELECT * FROM Devices', (error, results, fields) => {
        if (error) {
            console.error("Error al realizar la consulta: " + error.stack);
            res.status(500).send('Error al obtener los dispositivos');
            return;
        }
        res.status(200).json(results);
    });
});

// Apartado de la [ ESTADO DE LOS DISPOTIVOS. ].

app.put('/updateDeviceState', function(req, res) {
    // Imprimo los datos recibidos desde el frontend
    console.log("Dispositivo y Estado", req.body);

    // Verifico si recibo el ID del dispositivo y el nuevo estado
    if (req.body.id !== undefined && req.body.state !== undefined) {
        console.log(`[Backend]: El dispositivo con ID ${req.body.id} ha sido actualizado a: ${req.body.state ? 'On' : 'Off'}`);
        
        // Construyo la consulta para actualizar el estado
        utils.query("UPDATE Devices SET state=" + req.body.state + " WHERE id=" + req.body.id, 
            (err, resp, meta) => {
                if (err) {
                    console.log(err.sqlMessage);
                    res.status(409).send(err.sqlMessage);
                } else {
                    res.send("Estado actualizado correctamente. Respuesta: " + resp);
                }
            }
        );
    } else {
        // Si no se cumple, responder con un mensaje de error
        res.status(400).send('[Backend]: Datos incompletos o inválidos');
    }
});


app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
