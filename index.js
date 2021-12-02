var fs = require("fs");
var express = require("express");
var app = express();
var http = require("http").Server(app);

var { Server } = require("socket.io");
var io = new Server(http);

var bodyParser = require("body-parser");
//var passport = require("passport");
//var cookieSession = require("cookie-session");

var modelo = require("./servidor/modelo.js");
var ssrv = require("./servidor/servidorWS.js");

var juego = new modelo.Juego();
var servidorWS = new ssrv.ServidorWS();

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + "/"));
/*
app.use(cookieSession({
    name:'unocartas', //nombre de la cookie
    keys:["key1","key2"]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const haIniciado = function (request, response, next) {
    if (request.user) {
        next();
    }
    else {
        response.redirect("/");
    }
}
*/

app.get("/", function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

app.get("/agregarJugador/:nick", function (request, response) {
    var nick = request.params.nick;
    var res = juego.agregarJugador(nick);
    response.send(res);
});

app.get("/crearPartida/:nick/:numJug", function (request, response) {
    var nick = request.params.nick;
    var numJug = request.params.numJug;
    var jugador = juego.usuarios[nick]
    var res = { codigo: -1 };
    if (jugador) {
        var partida = jugador.crearPartida(numJug);
        console.log("Nueva partida de " + nick + " codigo: " + jugador.codigoPartida);
        res.codigo = jugador.codigoPartida;
    }
    response.send(res);
})

app.get("/unirAPartida/:codigo/:nick", function (request, response) {
    var codigo = request.params.codigo;
    var nick = request.params.nick;
    var jugador = juego.usuarios[nick];
    var partida = juego.partidas[codigo];

    var res = { codigo: -1 };
    if (partida) {
        partida.unirAPartida(jugador);
        res.codigo = jugador.codigoPartida;
    }
    response.send(res);
})

app.get("/obtenerTodasPartidas", function (request, response) {
    var lista = []

    for (each in juego.partidas) {
        var partida = juego.partidas[each]
        lista.push({ propietario: partida.propietario, codigo: each })
    }
    response.send(lista);
})

app.get("/obtenerPartidasDisponibles", function (request, response) {

    if (juego) {
        var lista = juego.obtenerPartidasDisponibles();
        response.send(lista);
    }
})

app.get("/obtenerTodosResultados", function (request, response) {
    if (juego) {
        juego.obtenerTodosResultados(function (lista) {
            response.send(lista);
        })
    }
})

app.get("obtenerResultados/:nick", function (request, response) {
    var nick = request.params.nick;
    if (juego) {
        juego.obtenerResultados({ ganador: nick }, function (lista) {
            response.send(lista);
        })
    }
})

app.get("/cerrarSesion/:nick", function (request, response) {
    var nick = request.params.nick;
    var jugador = juego.usuarios[nick];
    if (jugador) {
        jugador.cerrarSesion();
        response.send({ res: "ok" });
    }
})

app.post('/registrarUsuario', function (request, response) {
    var email = request.body.email;
    var clave = request.body.clave;

    juego.registrarUsuario(email, clave, function (data) {
        response.send(data);
    });
})

app.post('/loginUsuario', function (request, response) {
    var email = request.body.email;
    var clave = request.body.clave;

    juego.loginUsuario(email, clave, function (data) {
        response.send(data);
    });
})


http.listen(app.get('port'), function () {
    console.log("La app NodeJS se esta ejecutando en el puerto ", app.get("port"));
}) //el listen siempre tiene que estar el ultimo

//lanzar el servidor de web socket 
servidorWS.lanzarServidorWS(io, juego);