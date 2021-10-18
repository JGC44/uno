var fs = require("fs");
var express = require("express");
var app = express();
var server = require("http").Server(app);
var bodyParser = require("body-parser");
var modelo = require("./servidor/modelo.js");

var juego = new modelo.Juego();

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
app.get("/crearPartida/:num/:nick",function(request,response){
	var nick=request.params.nick;
	var num=request.params.num;
	var ju1=juego.usuarios[nick];
	var res={codigo:-1};
	if (ju1){
		var partida=ju1.crearPartida(num);
		console.log("Nueva partida de "+nick +" codigo: "+ju1.codigoPartida);
		res.codigo=ju1.codigoPartida;
	}
	response.send(res);
})
/*
//unir a partida
app.get("/unirAPartida/:cod/:nick", function (request, response) {
    var nick = request.params.nick;
    var cod = request.params.cod;
    var ju1 = juego.usuarios[nick];
    var res = { codigo: cod };
    if (ju1) {
        var partida = ju1.unirAPartida(num);
        console.log("Jugador de " + nick + " se ha unido a la partida de codigo: " + ju1.codigoPartida);
        res.codigo = ju1.codigoPartida;
    }
    response.send(res);
})
*/
//obtener lista de partidas

app.listen(app.get('port'), function () {
    console.log("La app NodeJS se esta ejecutando en el puerto", app.get("port"));
})