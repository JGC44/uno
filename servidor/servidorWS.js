function ServidorWS() {

    //Zona cliente del servidor WS
    this.enviarAlRemitente = function (socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    }

    this.enviarATodos = function (io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos);
    }

    //para actualizar la lista de forma automatica
    this.enviarGlobal = function (socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    }

    //Zona servidor del servidor WS
    this.lanzarServidorWS = function (io, juego) {
        var cli = this; //This usado para tener el contexto en una variable local

        io.on("connection", function (socket) {
            console.log("Usuario conectado");

            socket.on("crearPartida", function (nick, numJ) {
                var jug = juego.usuarios[nick]
                if (jug) {
                    var res = { codigo: -1 };
                    var partida = jug.crearPartida(numJ);
                    if (partida) {
                        console.log("Nueva partida de " + nick + " con codigo: " + partida.codigo);
                        res.codigo = jug.codigoPartida;
                        socket.join(res.codigo);
                        cli.enviarAlRemitente(socket, "partidaCreada", res);
                        var lista = juego.obtenerPartidasDisponibles();
                        cli.enviarGlobal(socket, "nuevaPartida", lista)
                    } else {
                        cli.enviarAlRemitente(socket, "fallo", "La partida no se ha podido crear");
                    }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe");
                }
            });

            socket.on("unirAPartida", function (codigo, nick) {
                var jugador = juego.usuarios[nick];
                var res = { codigo: -1 };
                var partida = juego.partidas[codigo];
                if (jugador && partida) {
                    jugador.unirAPartida(codigo);
                    res.codigo = jugador.codigoPartida;
                    if (res.codigo != -1) {
                        socket.join(codigo);
                        console.log("Jugador " + jugador.nick + " se une a partida codigo: " + jugador.codigoPartida)
                        var partida = juego.partidas[codigo];
                        cli.enviarAlRemitente(socket, "unidoAPartida", res);
                        if (partida.fase.nombre == "jugando") {
                            cli.enviarATodos(io, codigo, "pedirCartas", {});
                            var lista = juego.obtenerPartidasDisponibles();
                            cli.enviarGlobal(socket, "nuevaPartida", lista)
                        }
                    } else {
                        cli.enviarAlRemitente(socket, "fallo", res);
                    }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario o la partida no existe")
                }
            });

            socket.on("manoInicial", function (nick) {
                var jugador = juego.usuarios[nick];
                if (jugador) {
                    jugador.manoInicial()
                    cli.enviarAlRemitente(socket, "mano", jugador.mano);
                    var codigo = jugador.codigoPartida;
                    var partida = juego.partidas[codigo];
                    var nickTurno = partida.turno.nick;
                    cli.enviarAlRemitente(socket, "turno", { turno: nickTurno, cartaActual: partida.cartaActual });
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario o la partida no existe")
                }
            });

            socket.on("manoTurno", function (nick) {
				var jugador = juego.usuarios[nick];
				if (jugador) {
					cli.enviarAlRemitente(socket, "mano", jugador.mano);
				} else {
					cli.enviarAlRemitente(socket, "fallo", "El usuario no existe");
				}
			});

            socket.on("jugarCarta", function (nick, num) {
                var jugador = juego.usuarios[nick];
                if (jugador) {
                    jugador.jugarCarta(num);
                    cli.enviarAlRemitente(socket, "mano", jugador.mano);
                    var codigo = jugador.codigoPartida;
                    var partida = juego.partidas[codigo];
                    var nickTurno = partida.turno.nick;
                    if (jugador.mano.length == 1) {
                        cli.enviarATodos(io, codigo, "meQuedaUna", { nick: jugador.nick });
                    }
                    if (partida.fase.nombre == "final") {
                        console.log(partida.fase.nombre);
					    console.log(nickTurno);
                        cli.enviarATodos(io, codigo, "final", { ganador: nickTurno });
                    }
                    cli.enviarATodos(io, codigo, "turno", { turno: nickTurno, cartaActual: partida.cartaActual })
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe")
                }
            });

            socket.on("checkComodin", function (nick, num) {
                var jugador = juego.usuarios[nick];
                if (jugador) {
                    jugador.checkComodin(num);
                }
            });

            socket.on("colorComodin", function (nick, num, color) {
                var jugador = juego.usuarios[nick];
                if (jugador) {
                    jugador.colorComodin(num, color);
                }
            });

            socket.on("robar", function (nick, num) {
                var jugador = juego.usuarios[nick];
                if (jugador) {
                    var num = jugador.robar(num);
                    cli.enviarAlRemitente(socket, "mano", jugador.mano);
                    if (num == 0) {
                        var codigo = jugador.codigoPartida;
                        var partida = juego.partidas[codigo];
                        var nickTurno = partida.turno.nick;
                        cli.enviarATodos(io, codigo, "turno", { turno: nickTurno, cartaActual: partida.cartaActual })
                    }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe")
                }
            });

            socket.on("pasarTurno", function (nick) {
                var jugador = juego.usuarios[nick];
                if (jugador) {
                    jugador.pasarTurno();
                    //cli.enviarAlRemitente(socket, "mano", jugador.mano);
                    var codigo = jugador.codigoPartida;
                    var partida = juego.partidas[codigo];
                    var nickTurno = partida.turno.nick;
                    cli.enviarATodos(io, codigo, "turno", { turno: nickTurno, cartaActual: partida.cartaActual })
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe")
                }
            });

            //new
            socket.on("abandonarPartida", function (nick) {
                var ju1 = juego.usuarios[nick];
                if (ju1) {
                    ju1.abandonarPartida();
                    var codigo = ju1.codigoPartida;
                    cli.enviarATodos(io, codigo, "jugadorAbandona", {});
                }
            });

            socket.on("cerrarSesion", function (nick) {
                var ju1 = juego.usuarios[nick];
                if (ju1) {
                    var codigo = ju1.codigoPartida;
                    var partida = juego.partidas[codigo];
                    if (partida) {
                        ju1.abandonarPartida();
                        cli.enviarATodos(io, codigo, "jugadorAbandona", {});
                    }
                    ju1.cerrarSesion();
                    cli.enviarAlRemitente(socket, "usuarioEliminado", {});
                }
            });

        })
    }
}

module.exports.ServidorWS = ServidorWS;