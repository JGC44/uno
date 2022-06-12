var cf = require("./cifrado.js");
var cad = require("./cad.js");
var moduloEmail = require("./email.js");

function Juego(test) {
    this.usuarios = {};
    this.partidas = {};
    this.cad; //new cad.CAD();

    this.agregarJugador = function (nick) {
        var res = { nick: -1 }
        if (!this.usuarios[nick]) {
            var jugador = new Jugador(nick, this);
            this.usuarios[nick] = jugador;
            res = { nick: nick }
        }
        else {
            console.log("El nick: " + nick + " ya esta en uso");
        }
        return res;
    }

    this.eliminarUsuario = function(nick, clave, callback){
        var ju = this;
        this.cad.encontrarUsuarioCriterio({nick:nick}, function(usr){
            if (usr && clave==cf.decryptStr(usr.clave, 'sEcrEt')){
                ju.cad.eliminarUsuario(usr._id, function(result){
                    console.log("Usuario eliminado");
                    callback({res:1});
                })
            }
            else{
                callback({res:0});
            }
        })
    }

    this.editarUsuario = function(nickActual, nick, callback){
        var ju = this;
        this.cad.encontrarUsuarioCriterio({nick:nickActual}, function(usr){
            if (usr){
                usr.nick = nick;
                ju.cad.modificarColeccionUsuarios(usr, function(result){
                    console.log("Usuario actualizado");
                    callback({res:1});
                })
            }
            else{
                callback({res:0});
            }
        })
    }

    this.crearPartida = function (nick, numJug) {
        var jugador = this.usuarios[nick];
        if (numJug >= 2 && numJug <= 8) {
            var codigo = "-1";
            codigo = this.obtenerCodigo();
            while (this.partidas[codigo]) {
                codigo = this.obtenerCodigo();
            }
            var partida = new Partida(codigo, jugador, numJug);
            this.partidas[codigo] = partida;
        }
        return partida;
    }

    this.obtenerTodasPartidas = function () {
        var lista = []
        for (each in this.partidas) {
            var partida = this.partidas[each]
            lista.push({ propietario: partida.propietario, codigo: each })
        }
        return lista
    }

    this.obtenerPartidasDisponibles = function () {
        var lista = []
        for (each in this.partidas) {
            var partida = this.partidas[each]
            if (partida.fase.nombre == "inicial") {
                lista.push({ propietario: partida.propietario, codigo: each })
            }
        }
        return lista
    }

    this.unirAPartida = function (codigo, nick) {
        if (this.partidas[codigo]) {
            var jugador = this.usuarios[nick];
            this.partidas[codigo].unirAPartida(jugador);
        }
    }

    this.obtenerCodigo = function () {
        let cadena = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
        let letras = cadena.split('');
        let maxCadena = cadena.length;
        let codigo = [];
        for (i = 0; i < 6; i++) {
            codigo.push(letras[randomInt(1, maxCadena) - 1]);
        }
        return codigo.join('');
    }

    this.numeroPartidas = function () {
        return Object.keys(this.partidas).length;
    }

    //new
    this.borrarUsuario = function (nick) {
        delete this.usuarios[nick];
        console.log(this.usuarios[nick]);
    }

    this.obtenerTodosResultados = function (callback) {
        this.cad.obtenerTodosResultados(function (lista) {
            callback(lista);
        });
    }

    this.obtenerResultados = function (criterio, callback) {
        this.cad.encontrarResultadoCriterio(criterio, callback);
    }

    this.insertarResultado = function (resultado) {
        this.cad.insertarResultado(resultado, function (res) {
            console.log(res);
        })
    }

    this.registrarUsuario = function (email, clave, cb) {
        var ju = this;
        var claveCifrada = cf.encryptStr(clave, 'sEcrEt');
        var nick = email;
        var key = (new Date().valueOf()).toString();

        this.cad.encontrarUsuarioCriterio({ email: email }, function (usr) {
            if (!usr) {
                ju.cad.insertarUsuario({ email: email, clave: claveCifrada, key: key, nick: nick, confirmada: false }, function (usu) {
                    cb({ email: 'ok' });
                });
                moduloEmail.enviarEmailConfirmacion(email, key);
            }
            else {
                cb({ email: "nook" })
            }
        })
    }

    this.confirmarUsuario = function (email, key, cb) {
        var ju = this; //guardar referencia al objeto juego
        //verifica que existe
        this.cad.encontrarUsuarioCriterio({ email: email, key: key, confirmada: false }, function (usr) {
            if (usr) {
                usr.confirmada = true;
                //actualizar usuario
                ju.cad.modificarColeccionUsuarios(usr, function (result) {
                    cb({ res: "ok" });
                })
            }
            else {
                cb({ res: "nook" });
            }
        })

    }

    this.loginUsuario = function (email, clave, cb) {
        var ju = this;
        var nick = email;
        this.cad.encontrarUsuarioCriterio({ email: email }, function (usr) {
            if (usr) {
                var clavedesCifrada = cf.decryptStr(usr.clave, 'sEcrEt');
                if (clave == clavedesCifrada && usr.confirmada) {
                    cb(null, usr);
                    ju.agregarJugador(usr.nick);
                    console.log("Usuario " + usr.nick + " inicia sesión")
                }
                else {
                    cb(null)
                }
            }
            else {
                cb(null)
            }
        })
    }

    //Se ejecuta al crear el objeto juego
    if (!test) {
        this.cad = new cad.CAD();
        this.cad.conectar();
    }

}
//Fin juego

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function Jugador(nick, juego) {
    this.nick = nick;
    this.juego = juego;
    this.mano = [];
    this.codigoPartida;
    this.puntos = 0;
    this.estado = new Normal();
    this.haMarcadoMeQueda1=false;

    this.crearPartida = function (numJug) {
        return this.juego.crearPartida(nick, numJug);
    }

    this.unirAPartida = function (codigo) {
        this.juego.unirAPartida(codigo, nick);
    }

    this.robar = function (num) {
        var numRobadas = -1;
        var partida = this.obtenerPartida(this.codigoPartida);
        if (partida.fase.nombre == "jugando" && partida.turno.nick  == this.nick) {
            var robadas = partida.dameCartas(num);
            if (robadas.length <= 0) {
                partida.pasarTurno(this.nick);
                numRobadas = 0;
            } else {
                this.mano = this.mano.concat(robadas);
                numRobadas = robadas.length;
                this.haMarcadoMeQueda1=false;
            }
        }
        return numRobadas;
    }

    this.manoInicial = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        this.mano = partida.dameCartas(7);
    }

    this.obtenerPartida = function (codigo) {
        return this.juego.partidas[codigo];
    }

    this.pasarTurno = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        partida.pasarTurno(this.nick);
        this.robar(2);
    }

    this.jugarCarta = function (num) {
        var carta = this.mano[num];
        if (carta) {
            var partida = this.obtenerPartida(this.codigoPartida);
            partida.jugarCarta(carta, this.nick);
        }
    }

    this.quitarCarta = function (carta) {
        var partida = this.obtenerPartida(this.codigoPartida);
        var indice = this.mano.indexOf(carta);
        this.mano.splice(indice, 1);
        if (this.mano.length <= 0) {
            partida.finPartida();
        }
    }

    this.eliminarUsuario=function(callback){
        this.juego.eliminarUsuario(this._id, callback);
    }

    //new
    this.abandonarPartida = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        partida.fase = new Final();
        console.log("La partida ha terminado.");
    }

    this.cerrarSesion = function () {
        this.juego.borrarUsuario(this.nick);
    }

    //new (BBDD)
    this.insertarResultado = function (prop, numJug) {
        var resultado = new Resultado(prop, this.nick, this.puntos, numJug);
        this.juego.insertarResultado(resultado);
    }

    //new Bloqueo
    this.recibeTurno = function (partida) {
        this.estado.recibeTurno(partida, this);
    }
    this.bloquear = function(){
        this.estado = new Bloqueado();
    }

}
//Fin jugador

function Normal() {
    this.nombre = "normal"
    this.recibeTurno = function (partida, jugador) {
        partida.jugadorPuedeJugar(jugador);
    }

}

function Bloqueado() {
    this.nombre = "bloqueado"
    this.recibeTurno = function (partida, jugador) {
        partida.jugadorPuedeJugar(jugador);
        jugador.pasarTurno();
        jugador.estado = new Normal();

    }
}


function Partida(codigo, jugador, numJug) {
    this.codigo = codigo;
    this.mazo = [];
    this.propietario = jugador.nick;
    this.numJug = numJug;
    this.jugadores = {};
    this.fase = new Inicial();
    this.ordenTurno = [];
    this.direccion = new Derecha();
    this.turno;
    this.mesa = [];
    this.cartaActual;

    this.unirAPartida = function (jugador) {
        this.fase.unirAPartida(this, jugador);
    }

    this.puedeUnirAPartida = function (jugador) {
        this.jugadores[jugador.nick] = jugador;
        jugador.codigoPartida = this.codigo;
        this.ordenTurno.push(jugador.nick);
    }

    this.numeroJugadores = function () {
        return Object.keys(this.jugadores).length;
    }
    
    //Mazo
    this.crearMazo = function () {
        var colores = ["azul", "amarillo", "rojo", "verde"];
        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Numero(0, colores[i]));
        }
        for (i = 0; i < colores.length; i++) {
            for (j = 1; j <= 9; j++) {
                this.mazo.push(new Numero(j, colores[i]));
                this.mazo.push(new Numero(j, colores[i]));
            }
        }
        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Cambio(20, colores[i]))
            this.mazo.push(new Cambio(20, colores[i]))

            this.mazo.push(new Bloqueo(20, colores[i]))
            this.mazo.push(new Bloqueo(20, colores[i]))

            //this.mazo.push(new Mas2(20,colores[j]));
            //this.mazo.push(new Mas2(20,colores[j]));
        }
        /*
        for (i = 0; i < 4; i++) {
            this.mazo.push(new Comodin(50, ""));
            this.mazo.push(new Comodin4(50, ""));
        }
        */
    };

    this.asignarUnaCarta = function () {
        var maxCartas = this.mazo.length;
        var res;
        if (maxCartas > 0) {
            var indice = randomInt(1, maxCartas) - 1;
            var carta = this.mazo.splice(indice, 1);
            res = carta[0];
        }
        return res;
    }

    this.dameCartas = function (num) {
        var cartas = [];

        if (this.mazo.length < num) {
            this.mazo = this.mazo.concat(this.mesa);
            this.mesa = [];
        }

        for (i = 0; i < num; i++) {
            var carta = this.asignarUnaCarta();
            if (carta) {
                cartas.push(carta);
            }
        }
        return cartas;
    }

    //Asignar turno de forma aleatoria
    this.asignarTurno = function () {
        var random = randomInt(1, Object.keys(this.jugadores).length) - 1;
        var nick = this.ordenTurno[random];
        this.turno = this.jugadores[nick];
        console.log(nick + " empieza la partida.");
    }

    this.jugadorPuedeJugar = function (jugador) {
        this.turno = jugador;
    }

    this.pasarTurno = function (nick) {
        this.fase.pasarTurno(nick, this);
    }

    this.puedePasarTurno = function (nick) {
        if (nick == this.turno.nick) {
            this.direccion.pasarTurno(this)
        }
    }

    this.cartaInicial = function () {
        this.cartaActual = this.asignarUnaCarta();
    }

    this.jugarCarta = function (carta, nick) {
        this.fase.jugarCarta(carta, nick, this);
    }

    this.puedeJugarCarta = function (carta, nick) {
        if (nick == this.turno.nick) {
            if (this.comprobarCarta(carta)) {
                carta.comprobarEfecto(this);
                this.cambiarCartaActual(carta);
                this.turno.quitarCarta(carta);
                this.pasarTurno(nick);
            }
        }
    }

    this.cambiarCartaActual = function (carta) {
        this.mesa.push(this.cartaActual);
        this.cartaActual = carta;
    }

    //comprobar que se puede jugar la carta, según la que hay en la mesa
    this.comprobarCarta = function (carta) {
        return (this.cartaActual.tipo == "numero" && (this.cartaActual.color == carta.color || this.cartaActual.valor == carta.valor)
            || this.cartaActual.tipo == "cambio" && (this.cartaActual.color == carta.color || this.cartaActual.tipo == carta.tipo)
            || this.cartaActual.tipo == "bloqueo" && (this.cartaActual.color == carta.color || this.cartaActual.tipo == carta.tipo))
    }

    /*
    this.comprobarCarta = function (carta) {
        return (this.cartaActual.tipo == "numero" && (this.cartaActual.color == carta.color || this.cartaActual.valor == carta.valor)
            || this.cartaActual.tipo != "numero" && (this.cartaActual.color == carta.color || this.cartaActual.valor == carta.valor))
    }
    //Falta gestionar comodin y comodin4
    */

    this.cambiarDireccion = function () {
        if (this.direccion.nombre == "derecha") {
            this.direccion = new Izquierda();
        }
        else {
            this.direccion = new Derecha();
        }
    }

    this.finPartida = function () {
        this.fase = new Final();
        this.calcularPuntos()
        this.turno.insertarResultado(this.propietario, this.numJug);
    }

    this.calcularPuntos = function () {
        var suma = 0;
        for (var jug in this.jugadores) {
            for (i = 0; i < this.jugadores[jug].mano.length; i++) {
                suma = suma + this.jugadores[jug].mano[i].valor;
            }
        }
        this.turno.puntos = suma;
    }

    //new Bloqueo
    this.bloquearSiguiente = function () {
        //obtener quien es el siguiente jugador (Dirección)
        var jugador = this.direccion.obtenerSiguiente(this);
        //y bloquearlo
        jugador.bloquear();
    }

    this.crearMazo();
    this.unirAPartida(jugador);
}
//Fin objeto partida

function Inicial() {
    this.nombre = "inicial";

    this.unirAPartida = function (partida, jugador) {
        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores() == partida.numJug) {
            partida.fase = new Jugando();
            partida.asignarTurno();
            partida.cartaInicial();
        }
    }

    this.pasarTurno = function (nick, partida) {
        console.log("La partida no ha comenzado");
    }

    this.jugarCarta = function (carta, nick, partida) {
        console.log("La partida no ha comenzado");
    }
}

function Jugando() {
    this.nombre = "jugando";

    this.unirAPartida = function (partida, jugador) {
        console.log("No puedes unirte, la partida ya ha comenzado");
        jugador.codigoPartida = -1;
    }

    this.pasarTurno = function (nick, partida) {
        partida.puedePasarTurno(nick);
    }

    this.jugarCarta = function (carta, nick, partida) {
        partida.puedeJugarCarta(carta, nick);
    }
}

function Final() {
    this.nombre = "final";

    this.unirAPartida = function (partida, jugador) {
        console.log("No puedes unirte, la partida ya ha terminado");
    }

    this.pasarTurno = function (nick, partida) {
        console.log("La partida ha terminado");
    }

    this.jugarCarta = function (carta, nick, partida) {
        console.log("La partida ya ha terminado");
    }
}

function Derecha() {
    this.nombre = "derecha";
    this.pasarTurno = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice + 1) % (Object.keys(partida.jugadores).length);
        var jugador = partida.jugadores[partida.ordenTurno[siguiente]];
        jugador.recibeTurno(partida);
    }

    this.obtenerSiguiente = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice + 1) % (Object.keys(partida.jugadores).length);
        var jugador = partida.jugadores[partida.ordenTurno[siguiente]];
        return jugador;
    }
}

function Izquierda() {
    this.nombre = "izquierda";
    this.pasarTurno = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice - 1) % (Object.keys(partida.jugadores).length);
        if (siguiente < 0) { siguiente = Object.keys(partida.jugadores).length - 1 }
        var jugador = partida.jugadores[partida.ordenTurno[siguiente]];
        jugador.recibeTurno(partida);
    }
    this.obtenerSiguiente = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice - 1) % (Object.keys(partida.jugadores).length);
        if (siguiente < 0) { siguiente = Object.keys(partida.jugadores).length - 1 }
        var jugador = partida.jugadores[partida.ordenTurno[siguiente]];
        return jugador;
    }
}

function Numero(valor, color) {
    this.tipo = "numero";
    this.valor = valor;
    this.color = color;
    this.nombre = valor + color;
    this.comprobarEfecto = function (partida) {
        //console.log("No hay efectos");
    }
}

function Cambio(valor, color) {
    this.tipo = "cambio";
    this.nombre = "cambio" + color;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {
        partida.cambiarDireccion();
    }
}

//new
function Bloqueo(valor, color) {
    this.tipo = "bloqueo";
    this.nombre = "bloqueo" + color;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {
        partida.bloquearSiguiente();
    }
}

//Not implemented
function Mas2(valor, color) {
    this.tipo = "mas2";
    //this.nombre = "mas2" + color;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {

    }
}

//Not implemented
function Comodin(valor, color) {
    this.tipo = "comodin";
    //this.nombre = "comodin" + color;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {

    }
}

//Not implemented
function Comodin4(valor, color) {
    this.tipo = "comodin4";
    //this.nombre = "comodin4" + color;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {

    }
}

function Resultado(prop, ganador, puntos, numJug) {
    this.propietario = prop;
    this.ganador = ganador;
    this.puntos = puntos;
    this.numeroJugadores = numJug;
}

/*
var juego,partida,ju1,ju2,ju3;
function Prueba(){
    juego =new Juego();
    juego.agregarJugador("ana");
    ju1=juego.usuarios["ana"];
    ju1.crearPartida(3);
    juego.agregarJugador("pepe");
    ju2=juego.usuarios["pepe"];
    ju2.unirAPartida(ju1.codigoPartida);
    juego.agregarJugador("luis");
    ju3=juego.usuarios["luis"];
    ju3.unirAPartida(ju1.codigoPartida);
    partida=juego.partidas[ju1.codigoPartida];
    ju1.manoInicial();
    ju2.manoInicial();
    ju3.manoInicial();
    //partida.cartaInicial();
}
*/

module.exports.Juego = Juego