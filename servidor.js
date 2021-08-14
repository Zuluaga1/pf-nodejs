const express = require('express');
const app = express();
const mysql = require('mysql');

const path = require('path');
let _message;
app.listen(5000,()=>{
    console.log('server on port 5000')
});

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
//--------UDP----
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

socket.bind(10840);

socket.on('message', (msg, rinfo) => {
    _message;
    _message = msg.toString();
    console.log(_message)
    });



app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname + '/web/templates/home.html'));
});

app.use(express.static('web'));


//--------LIVE----------------
app.get("/live",(req,res)=>{
    res.sendFile(path.join(__dirname + '/web/templates/live.html'));

});
app.get("/live1",(req,res)=>{
    _message
    res.end(JSON.stringify(_message));
});

//----------dashboard--------------------
app.get('/da', function(req, res) {
    let sql = 'SELECT r.rol, count(e.rol) as num FROM placas.entrada e, placas.rol r  where e.rol=r.idrol  group by e.rol having count(e.rol)>1 ORDER by e.idEntrada;'
    let query = database.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.end(JSON.stringify(result));
    });
});

app.get('/dashboard', function(req, res){
    res.sendFile(path.join(__dirname + '/web/templates/dashboard.html'));
});

app.get('/usuarios', function(req, res){
    let sql = 'SELECT * FROM log;'
    let query = database.query(sql, (err, result) => {
        if (err) throw err;
        res.render('usuarios', {results:result});
    });    
});

app.get('/delete/:idlog', (req, res)=>{
    const idlog = req.params.idlog;
    let sql = 'DELETE FROM log WHERE idlog= ?' 
    let query = database.query(sql,[idlog], (err, result) => {
        if (err) throw err;
        //console.log(result)
        res.redirect('/usuarios')
    });
});
