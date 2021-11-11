var fs = require("fs");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var { Server } = require("socket.io");
var io = new Server(http);
var bodyParser = require("body-parser");

var modelo = require("./servidor/modelo.js");
var ssrv = require("./servidor/servidorWS.js");

var juego = new modelo.Juego();
var servidorWS = new ssrv.ServidorWS();

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + "/"));

app.get("/", function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

//agregar Usuario
app.get("/agregarJugador/:nick", function (request, response) {
    var nick = request.params.nick;
    var res = juego.agregarJugador(nick);
    response.send(res);
});

//crear partida
app.get("/crearPartida/:num/:nick", function (request, response) {
    var nick = request.params.nick;
    var num = request.params.num;
    var ju = juego.usuarios[nick];
    var res = { codigo: -1 };
    if (ju) {
        var partida = ju.crearPartida(num);
        console.log("Nueva partida de " + nick + " codigo: " + ju.codigoPartida);
        res.codigo = ju.codigoPartida;
    }
    response.send(res);
})

//unir a partida (Error)
app.get("/unirAPartida/:codigo/:nick", function (request, response) {
    var nick = request.params.nick;
    var codigo = request.params.codigo;
    var ju2 = juego.usuarios[nick];
    var res = { codigo: -1 };
    // if (ju2)
    if (juego.partidas[codigo] && (!juego.partidas[codigo].jugadores[nick])) {
        ju2.unirAPartida(codigo);
        console.log("Jugador de " + nick + " se ha unido a la partida de codigo: " + ju.codigoPartida);
        //res.code=500; //si funciona bien
        res.codigo = ju.codigoPartida;
    }
    response.send(res);
})

//obtener lista de partidas
app.get("/obtenerListaPartidas",function(request,response){
	if (juego){
		var lista=juego.obtenerTodasPartidas();
		response.send(lista);
	}
});

http.listen(app.get('port'), function () {
    console.log("La app NodeJS se esta ejecutando en el puerto", app.get("port"));
});

//jugar carta
app.get("/jugarCarta/:nick/:numero", function (request, response) {
    var nick = request.params.nick;
    var numeroCarta = request.params.numero;
    var jugador = juego.usuarios[nick];

    var res ={code:-1};
    if (jugador.mano.length!=0){
        jugador.jugarCarta(numeroCarta);
        res.code=500;//si funciona bien
    }
    response.send(res);
})

//robar cartas
app.get("/robar/:nick/:numero", function (request, response) {
    var nick = request.params.nick;
    var cartasARobar = request.params.numero;
    var jugador = juego.usuarios[nick];

    var res ={code:-1};
    if (jugador.mano){//no se que poner
        jugador.robar(cartasARobar);
        res.code=500;
    }
    response.send(res);
})

//lanzar el servidor de WS
servidorWS.lanzarServidorWS(io, juego);