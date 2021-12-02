var cad = require("./cad.js");

function Juego() {
    this.usuarios = {};
    this.partidas = {};
    this.cad = new cad.CAD();

    this.agregarJugador = function (nick) {
        var res = { nick: -1 }
        if (!this.usuarios[nick]) {
            var jugador = new Jugador(nick, this);
            this.usuarios[nick] = jugador;
            res = { nick: nick }
        }
        else {
            console.log("El nick ya esta en uso");
        }
        return res;
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

    this.borrarUsuario = function (nick) {
        delete this.usuarios[nick];
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

        this.cad.encontrarUsuarioCriterio({ email: email }, function (usr) {
            if (!usr) {
                ju.cad.insertarUsuario({ email: email, clave: claveCifrada, nick: nick }, function (usu) {
                    cb({ email: 'ok' });
                })
            }
            else {
                cb({ email: "nook" })
            }
        })
    }

    this.loginUsuario = function (email, clave, cb) {
        var ju = this;
        var nick = email;
        this.cad.encontrarUsuarioCriterio({ email: email }, function (usr) {
            if (usr) {
                var clavedesCifrada = cf.decryptStr(usr.clave, 'cLaVeSecrEtA');
                if (clave == clavedesCifrada) {
                    cb(null, usr);
                    ju.agregarJugador(usr.nick);
                    console.log("Usuario inicia sesión")
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


    //Esto se ejecuta al crear el objeto juego
    this.cad.conectar(function () {

    })
}

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

    this.crearPartida = function (numJug) {
        return this.juego.crearPartida(nick, numJug);
    }

    this.unirAPartida = function (codigo) {
        this.juego.unirAPartida(codigo, nick);
    }

    this.robar = function (num) {
        var numRobadas = -1;
        var partida = this.obtenerPartida(this.codigoPartida);
        if (partida.turno.nick == this.nick) {
            var robadas = partida.dameCartas(num);
            if (robadas.length <= 0) {
                partida.pasarTurno(this.nick);
                numRobadas = 0;
            } else {
                this.mano = this.mano.concat(robadas);
                numRobadas = robadas.length;
            }
        }
        return numRobadas;
    }

    this.manoInicial = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        this.mano = partida.dameCartas(2);
    }

    this.obtenerPartida = function (codigo) {
        return this.juego.partidas[codigo];
    }

    this.pasarTurno = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        partida.pasarTurno(this.nick);
        this.robar(1);
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

    this.abandonarPartida = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        partida.fase = new Final();
    }

    this.cerrarSesion = function () {
        this.juego.borrarUsuario(this.nick);
    }

    this.insertarResultado = function (prop, numJug) {
        var resultado = new Resultado(prop, this.nick, this.puntos, numJug);
        this.juego.insertarResultado(resultado);
    }

    /*
    this.recibeTurno=function(partida){
        this.estado.recibeTurno(partida,this);
    }
    */

    this.bloquear = function () {
        jugador.estado = new Bloqueado();
    }
}

function Normal() {
    this.nombre = "normal"
    this.recibeTurno = function (partida, jugador) {
        partida.jugadorPuedeJugar(jugador);
    }

}

function Bloqueado() {
    this.nombre = "bloqueado"
    this.recibeTurno = function (partida, jugador) {
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
    /*
        Mazo completo
    
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
    
                this.mazo.push(new Mas2(20, colores[i]))
                this.mazo.push(new Mas2(20, colores[i]))
            }
            for (i = 0; i < 4; i++) {
                this.mazo.push(new Comodin(50, ""));
                this.mazo.push(new Comodin4(50, ""));
            }
        }
    */
    this.crearMazo = function () {
        var colores = ["azul", "amarillo", "verde", "rojo"];
        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Numero(0, colores[i]));
        }
        for (j = 0; j < colores.length; j++) {
            for (i = 1; i < 5; i++) {
                this.mazo.push(new Numero(i, colores[j]));
                //this.mazo.push(new Numero(i,colores[j]));
            }
        }
        for (j = 0; j < colores.length; j++) {
            this.mazo.push(new Cambio(20, colores[j]));
            //this.mazo.push(new Cambio(20,colores[j]));
        }
        // for(j=0;j<colores.length;j++){
        //     this.mazo.push(new Bloqueo(20,colores[j]));
        //     this.mazo.push(new Bloqueo(20,colores[j]));
        // }
        // for(j=0;j<colores.length;j++){
        //     this.mazo.push(new Mas2(20,colores[j]));
        //     this.mazo.push(new Mas2(20,colores[j]));
        // }
        // for (i=1;i<5;i++){
        //     this.mazo.push(new Comodin(20));
        //     this.mazo.push(new Comodin4(20));
        // }
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

    this.asignarTurno = function () {
        var nick = this.ordenTurno[0]
        this.turno = this.jugadores[nick]
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
    /*
        this.comprobarCarta = function (carta) {
            return (this.cartaActual.tipo == "numero" && (this.cartaActual.color == carta.color || this.cartaActual.valor == carta.valor)
                || this.cartaActual.tipo == "cambio" && (this.cartaActual.color == carta.color || this.cartaActual.tipo == carta.tipo))
        }
    */
    this.comprobarCarta = function (carta) {
        return (this.cartaActual.tipo == "numero" && (this.cartaActual.color == carta.color || this.cartaActual.valor == carta.valor)
            || this.cartaActual.tipo != "numero" && (this.cartaActual.color == carta.color || this.cartaActual.valor == carta.valor))
    }
    //Falta gestionar comodin y comodin4


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

    this.bloquearSiguiente = function () {
        //obtener quie es el siguiente jugador (Dirección)
        var jugador = this.direccion.obtenerSiguiente(this);
        //y bloquearlo
        jugador.bloquear();
    }

    this.crearMazo();
    this.unirAPartida(jugador);
}

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
        partida.turno = partida.jugadores[partida.ordenTurno[siguiente]];
    }
    //falta


}

function Izquierda() {
    this.nombre = "izquierda";
    this.pasarTurno = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice - 1) % (Object.keys(partida.jugadores).length);
        if (siguiente < 0) { siguiente = Object.keys(partida.jugadores).length - 1 }
        partida.turno = partida.jugadores[partida.ordenTurno[siguiente]];
    }
}

function Numero(valor, color) {
    this.tipo = "numero";
    this.nombre = "numero" + valor;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {
        console.log("No hay efectos");
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

function Bloqueo(valor, color) {
    this.tipo = "bloqueo";
    this.nombre = "bloqueo" + color;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {
        //partida.bloquearSiguiente();
    }
}

function Mas2(valor, color) {
    this.tipo = "mas2";
    //this.nombre = "mas2" + color;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {

    }
}

function Comodin(valor, color) {
    this.tipo = "comodin";
    //this.nombre = "comodin" + color;
    this.valor = valor;
    this.color = color;
    this.comprobarEfecto = function (partida) {

    }
}

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