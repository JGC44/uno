function ClienteWS() {
    this.socket;
    this.nick;
    this.codigo;

    //Peticiones (Zona cliente del clienteWS)
    this.conectar = function () {
        this.socket = io();
        this.servidorWSCliente();
    }

    this.crearPartida = function (nick, numJug) {
        this.nick = nick;
        this.socket.emit("crearPartida", nick, numJug);
    }

    this.unirAPartida = function (codigo, nick) {
        this.nick = nick;
        this.socket.emit("unirAPartida", codigo, nick);
    }

    this.manoInicial = function () {
        this.socket.emit("manoInicial", this.nick);
    }

    this.jugarCarta = function (num) {
        this.socket.emit("jugarCarta", this.nick, num);
    }

    this.checkComodin = function (num) {
        this.socket.emit("checkComodin", this.nick, num);
    }

    this.colorComodin = function (num, color) {
        this.socket.emit("colorComodin", this.nick, num, color);
    }

    this.robarCarta = function (num) {
        this.socket.emit("robar", this.nick, num);
    }

    this.pasarTurno = function () {
        this.socket.emit("pasarTurno", this.nick);
    }

    //new
    this.obtenerMano=function(){
		this.socket.emit("obtenerMano",this.nick);
	}

    this.abandonarPartida = function () {
        this.socket.emit("abandonarPartida", this.nick);
    }

    this.cerrarSesion = function () {
        rest.cerrarSesion();
        this.socket.emit("cerrarSesion", this.nick);
    }

    /*
    this.finalPartida=function(){
		this.socket.emit("finalPartida",this.nick);	
	}
    */

    //Espera de respuestas, a la escucha (Zona servidor del clienteWS)
    this.servidorWSCliente = function () {
        var cli = this;
        this.socket.on("connect", function () {
            console.log("conectado al servidor de WS");
        })

        this.socket.on("partidaCreada", function (data) {
            console.log(data);
            ws.codigo = data.codigo;
            iu.mostrarCodigo(ws.codigo);
            iu.mostrarEsperando();
        })

        this.socket.on("nuevaPartida", function (data) {
            console.log(data);
            if ((!cli.codigo) && (cli.nick)) {
                iu.mostrarListaPartidas(data);
            }
        })

        this.socket.on("unidoAPartida", function (data) {
            console.log(data);
            cli.codigo = data.codigo;
            iu.mostrarEsperando();
        })

        this.socket.on("pedirCartas", function (data) {
            cli.manoInicial();
            iu.mostrarRobar();
        })

        this.socket.on("mano", function (data) {
            console.log(data);
            iu.mostrarMano(data);
        })

        this.socket.on("turno", function (data) {
            console.log(data);
            iu.mostrarCartaActual(data.cartaActual);
            iu.mostrarTurno(data.turno);
        })

        this.socket.on("meQuedaUna", function (data) {
            if (data.nick == cli.nick) {
                iu.mostrarModal("Te queda Una!!");
            }
            else {
                iu.mostrarModal("El jugador: " + data.nick + " ha dicho UNO!!");
            }
        });

        this.socket.on("cambiarColor", function (data) {
            var color = data.color;
            if (data.nick == cli.nick) {
                iu.mostrarModal("Has cambiado a " + color);
            }
            else {
                iu.mostrarModal("El jugador: " + data.nick + " ha cambiado a " + color);
            }
        });

        this.socket.on("final", function (data) {
            if (data.ganador == cli.nick) {
                iu.mostrarModal("Enhorabuena, has ganado!!");
                iu.mostrarAbandonarJuego();
            }
            else {
                iu.mostrarModal("Game Over, " + data.ganador + " ha ganado." );
                iu.mostrarAbandonarJuego();
            }

        });

        this.socket.on("fallo", function (data) {
            console.log(data);
			iu.mostrarModal(data);
			iu.mostrarHome();
            /*
            iu.limpiar();
			iu.comprobarUsuario();
            */
        })
        
        this.socket.on("abandonarPartida", function (data) {
			ui.mostrarModal("Un jugador ha abandonado la partida");
            ui.limpiar();
            ui.mostrarHome({ nick: cli.nick });
            cli.codigo = "";
		});
        
        this.socket.on("jugadorAbandona", function (data) {
            ui.mostrarModal("Un jugador ha abandonado la partida");
            ui.limpiar();
            ui.mostrarHome({ nick: cli.nick });
            cli.codigo = "";
        });

        //new
        this.socket.on("usuarioEliminado", function (data) {
            cli.nick = "";
            cli.codigo = "";
            //ws.usuarioEliminado();
            $.removeCookie("nick");
            ui.limpiar();
            ui.mostrarAgregarJugador();
        });
    }
    this.conectar();
}