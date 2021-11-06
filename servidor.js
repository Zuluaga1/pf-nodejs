const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const alert = require("alert");
session = require("express-session");
const passport = require("passport");
const net = require("net");
const path = require("path");
var _message;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.listen(5000, () => {
  console.log("server on port 5000");
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//MOTOR DE PLANTILLAS--------------------------------------
app.set("view engine", "ejs");

//Conexión con la base de datos-----------


/* const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "placas",
  port: 8111,
}); */

database.connect((err) => {
  if (err) {
    throw err;
  }

  console.log("Connected to DB");
});

//---------------TCP----------------
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log("mensaje recibido del cliente: " + data);
    _message = data.toString();
    console.log(_message);
    socket.end();
  });
  socket.on("close", () => {
    console.log("comunicación finalizada");
  });
  socket.on("error", (err) => {
    console.log(err.message);
  });
});
server.listen({
  host: "3.138.106.108",
  port: 10841,
  exclusive: true,
});

//--------------------------server----------------
app.use(express.static("web"));

//creación de rutas----------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/web/templates/home.html"));
});

//------------------login----------------------
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/web/templates/loginp.html"));
});
//Comprobación de contraseñas------
app.post("/login", (req, res) => {
  var username = req.body.usuario;
  var password = req.body.contraseña;
  const admin = "admin";
  if (username && password) {
    //let sql = `SELECT l.username, l.password, r.rol from log l, rol r WHERE l.username LIKE '${username}' AND l.password LIKE '${password}' AND r.idrol = l.rol`;
    let sql = `SELECT l.username, l.password, r.rol from log l, rol r WHERE l.username LIKE '${username}' AND r.idrol = l.rol`;
    let query = database.query(sql, (err, results) => {
      if (results.length > 0) {
        if (err) {
          res.send("Incorrect Username and/or Password!");
        } else if (username == results[0].username && admin == results[0].rol) {
          bcrypt.compare(password, results[0].password, function (err, result) {
            if (result == true) {
              req.session.loggedin = true;
              res.redirect("/dashboard");
            } else {
              console.log("Incorrect Username and/or Password!");
            }
          });
        } else {
          alert("Incorrect Username and/or Password!");
          res.redirect("/login");
        }
      } else {
        res.redirect("/login");
        alert("Incorrect Username and/or Password!");
      }
    });
  }
});

//--------LIVE----------------
app.get("/live", (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname + "/web/templates/live.html"));
  } else {
    alert("PRIMERO DEBE INGRESAR");
    res.redirect("/login");
  }
});
//Cambiar estado de los sensores-------
app.get("/live1", (req, res) => {
  _message;
  res.end(JSON.stringify(_message));
});

//----------dashboard--------------------
app.get("/da", function (req, res) {
  /* let sql =
    "SELECT r.rol, count(e.rol) as num FROM placas.entrada e, placas.rol r  where e.rol=r.idrol  group by e.rol having count(e.rol)>0 ORDER by e.idEntrada";
     */
  let sql =
    "SELECT r.rol, count(e.rol) as num FROM placas.log e, placas.rol r  where e.rol=r.idrol  group by r.rol having count(e.rol)>0 ORDER by r.idrol";
  let query = database.query(sql, (err, result) => {
    if (err) throw err;
    //console.log(result)
    res.end(JSON.stringify(result));
  });
});

app.get("/da2", function (req, res) {
  let sql =
    "SELECT count(*) as total FROM placas.historicos where MODO = 'entrada';";
  let query = database.query(sql, (err, result) => {
    if (err) throw err;
    //console.log(result);
    //console.log(result[0].total);
    res.end(JSON.stringify(result));
  });
});

app.get("/da1", function (req, res) {
  let sql =
    "SELECT count(PLACA) as Trimestres, FECHA FROM historicos WHERE MODO ='entrada' GROUP BY QUARTER(FECHA);";
  let query = database.query(sql, (err, result) => {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

app.get("/dashboard", function (req, res) {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname + "/web/templates/dashboard.html"));
  } else {
    alert("PRIMERO DEBE INGRESAR");
    res.redirect("/login");
  }
});

//------------------tabla con usuarios-----------------------------s
app.get("/usuarios", function (req, res) {
  if (req.session.loggedin) {
    let sql = "SELECT * FROM log l, rol r WHERE l.rol = r.idrol;";
    let query = database.query(sql, (err, result) => {
      let roles = [];
      for (let rols in result) {
        if (result[rols].rol == 1) {
          roles.push("visitante");
        } else if (result[rols].rol == 2) {
          roles.push("Trabajador");
        } else if (result[rols].rol == 3) {
          roles.push("Contratista");
        } else {
          roles.push("Administrador");
        }
      }
      if (err) throw err;
      res.render("usuarios", { results: result });
    });
  } else {
    alert("PRIMERO DEBE INGRESAR");
    res.redirect("/login");
  }
});

//Ruta de edición-----------------------
app.get("/edit/:idlog", function (req, res) {
  const idlog = req.params.idlog;
  let sql =
    "SELECT l.idlog, l.username, l.fullname, l.placa, l.estado, r.rol FROM log l, rol r WHERE l.rol = r.idrol AND idlog = ?";
  let query = database.query(sql, [idlog], (err, result) => {
    if (err) throw err;
    res.render("edit", { user: result[0] });
  });
});

//Actualizar datos de usuarios-----------------------
app.post("/update", (req, res) => {
  let id = req.body.id;
  let username = req.body.user;
  let rol = req.body.rol;
  let fullname = req.body.fullname;
  let placa = req.body.placa;
  let estado = req.body.estado;
  let sql = "UPDATE log SET ? WHERE idlog = ?";
  let query = database.query(
    sql,
    [
      {
        username: username,
        fullname: fullname,
        placa: placa,
        rol: rol,
        estado: estado,
      },
      id,
    ],
    (err, result) => {
      if (err) throw err;
      res.redirect("/usuarios");
    }
  );
});

app.get("/delete/:idlog", (req, res) => {
  let idlog = req.params.idlog;
  let sql = "DELETE FROM log WHERE idlog = ?";
  let query = database.query(sql, [idlog], (err, result) => {
    if (err) throw err;
    res.redirect("/usuarios");
  });
});

app.post("/api/v1/login", (req, res) => {
  let username = req.body.usuario;
  let password = req.body.contraseña;
  if (username && password) {
    let sql = `SELECT * from placas.log WHERE username LIKE '${username}'`;
    let query = database.query(sql, (err, results) => {
      if (results.length > 0) {
        let data = {
          pro_nombre: "login",
          pro_placa: results[0].placa,
        };

        if (err) {
          console.log("Incorrect Username and/or Password!");
        } else if (username == results[0].username) {
          bcrypt.compare(password, results[0].password, function (err, result) {
            if (result == true) {
              console.log("Login");
              res.json([data]);
            } else {
              console.log("Incorrect Username and/or Password!");
            }
          });
        }
      }
    });
  }
});

app.post("/api/v1/users", (req, res) => {
  let username = req.body.usuario;
  let fullname = req.body.fullname;
  let password = req.body.contraseña;
  let placa = req.body.placa;
  let rol = req.body.rol;
  let estado = "denegado";
  if (rol == "visitante") {
    rol = 1;
  } else if (rol == "trabajador") {
    rol = 2;
  } else {
    rol = 3;
  }
  // Store hash in your password DB.
  hash = bcrypt.hashSync(password, salt);
  let sql = `INSERT INTO log  (username, password, fullname, placa, rol, estado) VALUES ('${username}', '${hash}', '${fullname}', '${placa}', '${rol}', '${estado}')`;
  let query = database.query(sql, (err, result) => {
    if (err) throw err;
  });
  const data = {
    pro_nombre: "esteban",
    pro_placa: "zzz300",
  };
  res.json([data]);
});
