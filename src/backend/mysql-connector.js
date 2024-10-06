//=======[ Settings, Imports & Data ]==========================================

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'mysql-server',
    port     : '3306',
    user     : 'root',
    password : 'userpass',
    database : 'smart_home'
});

//=======[ Main module code ]==================================================

setTimeout(() => { 
    // Debo retrasa la conexión 5 segundos para asegurarme que el servicio MySQL esté operativo.
    connection.connect(function(err) {
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            return;
        }
        console.log('Connected to DB under thread ID: ' + connection.threadId);
    });
}, 5000); // Espera 5 segundos antes de intentar conectarse


module.exports = connection;

//=======[ End of file ]=======================================================
