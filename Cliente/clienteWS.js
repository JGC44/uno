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

    this.robarCarta = function (num) {
        this.socket.emit("robar", this.nick, num);
    }

    this.pasarTurno = function () {
        this.socket.emit("pasarTurno", this.nick);
    }

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
        /*
                this.socket.on("final", function (data) {
                    ws.codigo = "";
                    iu.mostrarModal("¡¡" + data.ganador + " ha ganado la partida!!");
                })
        */
        this.socket.on("final", function (data) {
            if (data.ganador == cli.nick) {
                iu.mostrarModal("Game Over. Enhorabuena, has ganado!!");
                iu.abandonar();
            }
            else {
                iu.mostrarModal("Game Over. Ha ganado: " + data.ganador);
                iu.abandonar();
            }
        });

        this.socket.on("fallo", function (data) {
            console.log(data);
        })
        /*
        this.socket.on("jugadorAbandona", function (data) {
                    ui.mostrarModal("Un jugador ha abandonado la partida");
                    ui.limpiar();
                    ui.mostrarHome({nick:cli.nick});
                    cli.codigo="";
                });
                this.socket.on("usuaruioEliminado", function (data) {
                    cli.nick="";
                    cli.codigo="";
                    $.removeCookie("nick");
                    ui.limpiar();
                    ui.mostrarAgregarJugador();
                });
        */
    }
    this.conectar();
}