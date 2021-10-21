function ServidorWS() {
    //(Zona cliente del servidorWS)
    this.enviarAlRemitente = function (socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    }
    this.enviarATodos = function (io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos);
    }

    //(Zona servidor del servidorWS)
    this.lanzarServidorWS = function (io, juego) {
        var cli = this;
        io.on("connection", function (socket) {
            console.log("Usuario conectado");

            socket.on("crearPartida", function (num, nick) {
                var ju = juego.usuarios[nick];
                var res = { codigo: -1 };
                ju.crearPartida(num);
                console.log("Nueva partida de " + nick + " con codigo: " + ju.codigoPartida);
                res.codigo = ju.codigoPartida;
                socket.join(res.codigo);
                cli.enviarAlRemitente(socket, "partidaCreada", res);
            });

            socket.on("unirAPartida", function (codigo, nick) {
                var ju = juego.usuarios[nick];
                var res = { codigo: -1 };
                ju.unirAPartida(codigo);
                console.log("El jugador " + nick + " se ha unido a la partida de codigo: " + ju.codigoPartida);
                res.codigo = ju.codigoPartida;
                if (res.codigo != -1) {
                    socket.join(res.codigo);
                    cli.enviarAlRemitente(socket, "unidoAPartida", res);
                    var partida = juego.partidas[codigo];
                    if (partida.fase.nombre == "jugando") {
                        cli.enviarATodos(io, codigo, "pedirCartas", {});
                    }
                }
                else {
                    cli.enviarAlRemitente(socket, "fallo", res);
                }
            });
            socket.on("manoInicial", function (nick) {
                var ju = juego.usuarios[nick];
                ju.manoInicial();
                cli.enviarAlRemitente(socket, "mano", ju.mano);
            });
        })
    }
}


module.exports.ServidorWS = ServidorWS;