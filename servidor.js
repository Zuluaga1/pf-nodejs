const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
let alert = require('alert');
session = require('express-session');
const passport = require('passport');
//app.use(bodyParser());

const net = require('net');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const path = require('path');
let _message;
app.listen(5000, () => {
    console.log('server on port 5000')
});
app.use(bodyParser.urlencoded({
    extended: true
}));
//MOTOR DE PLANTILLAS--------------------------------------
app.set('view engine', 'ejs');

const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "placas",
    port: 8111
});

database.connect((err) => {
    if (err) {
        throw err;
    }

    console.log('Connected to DB');
});
//--------UDP----------------------
/* const dgram = require('dgram');
const { request } = require('http');
const socket = dgram.createSocket('udp4');
socket.bind(10840);

socket.on('message', (msg, rinfo) => {
    _message;
    _message = msg.toString();
    console.log(_message)
}); */
//---------------TCP----------------
const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log('mensaje recibido del cliente: ' + data)
        _message = data.toString();
        console.log(_message)
        socket.end();
    })
    socket.on('close', () => {
        console.log('comunicación finalizada')
    })
    socket.on('error', (err) => {
        console.log(err.message)
    })
});
/*  server.listen({
    host: '192.168.1.84',
    port: 10841,
    exclusive: true
});  */
//--------------------------server----------------
app.use(express.static('web'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/web/templates/home.html'));
});

//------------------login----------------------
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/web/templates/loginp.html'));
});
app.post('/login', (req, res) => {
    var username = req.body.usuario;
    var password = req.body.contraseña;
    const admin = "admin";
    console.log(username, password)
    if (username && password) {
        let sql = `SELECT l.username, l.password, r.rol from log l, rol r WHERE l.username LIKE '${username}' AND l.password LIKE '${password}' AND r.idrol = l.rol`;
        let query = database.query(sql, (err, results) => {
            if (results.length > 0) {
                //console.log(results[0].rol)
                if (err) {
                    res.send('Incorrect Username and/or Password!');
                }
                else if (username == results[0].username && password == results[0].password && admin == results[0].rol) {
                    req.session.loggedin = true;
                    res.redirect('/dashboard');
                }

            }
            else {
                res.redirect('/login')
                alert("Incorrect Username and/or Password!");
            }

        });

    }



});




//--------LIVE----------------
app.get("/live", (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname + '/web/templates/live.html'));
    } else {
        alert("PRIMERO DEBE INGRESAR")
        res.redirect('/login')
    }
});
app.get("/live1", (req, res) => {
    _message
    res.end(JSON.stringify(_message));
});

//----------dashboard--------------------
app.get('/da', function (req, res) {
    let sql = 'SELECT r.rol, count(e.rol) as num FROM placas.entrada e, placas.rol r  where e.rol=r.idrol  group by e.rol having count(e.rol)>1 ORDER by e.idEntrada;'
    let query = database.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.end(JSON.stringify(result));
    });
});

app.get('/dashboard', function (req, res) {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname + '/web/templates/dashboard.html'));
    } else {
        alert("PRIMERO DEBE INGRESAR")
        res.redirect('/login')
    }

});
//------------------tabla con usuarios-----------------------------s
app.get('/usuarios', function (req, res) {
    if (req.session.loggedin) {
        let sql = 'SELECT * FROM log;'
        let query = database.query(sql, (err, result) => {
            if (err) throw err;
            res.render('usuarios', { results: result });
        });
    } else {
        alert("PRIMERO DEBE INGRESAR")
        res.redirect('/login')
    }
});

app.get('/delete/:idlog', (req, res) => {
    const idlog = req.params.idlog;
    let sql = 'DELETE FROM log WHERE idlog= ?'
    let query = database.query(sql, [idlog], (err, result) => {
        if (err) throw err;
        //console.log(result)
        res.redirect('/usuarios')
    });
});

app.post('/api/crear', (req, res) => {
    //console.log(req.params)
    console.log(req.body)
    const data = {
        "pro_nombre": "esteban",
        "pro_placa": "zzz300"
    }
    let username = req.body.usuario;
    let password = req.body.contraseña;
    if (username && password) {
        let sql = `SELECT l.username, l.password, r.rol from log l, rol r WHERE l.username LIKE '${username}' AND l.password LIKE '${password}'`;
        let query = database.query(sql, (err, results) => {
            if (results.length > 0) {
                //console.log(results[0].rol)
                if (err) {
                    console.log('Incorrect Username and/or Password!');
                }
                console.log("Login")
                res.json([data])
            }
            else {
                console.log('Incorrect Username and/or Password!');
            }
        });
    };
});

app.post('/api/n_user', (req, res) => {
    console.log(req.body)
    let username = req.body.usuario;
    let fullname = req.body.fullname;
    let password = req.body.contraseña;
    let placa = req.body.placa;
    let rol = req.body.rol;
    let visitante = "visitante";
    let contratista = "contratista";
    let trabajador = "trabajador"
    if (rol == "visitante") {
        rol = 1
    } else if (rol == "trabajador") {
        rol = 2
    } else {
        rol = 3
    }
    let sql = `INSERT INTO log  (username, password, fullname, placa, rol) VALUES ('${username}', '${password}', '${fullname}', '${placa}', '${rol}')`;
    let query = database.query(sql, (err, result) => {
        if (err) throw err;
    });
    const data = {
        "pro_nombre": "esteban",
        "pro_placa": "zzz300"
    }
    res.json([data])
});

