function ClienteWS() {
    this.socket;
    this.nick;
    this.codigo;
    
    //Peticiones (Zona cliente del clienteWS)
    this.conectar = function () {
        this.socket = io();
        this.servidorWSCliente();
    }
    this.crearPartida = function (num, nick) {
        this.nick = nick;
        this.socket.emit("crearPartida", num, nick);
    }
    this.unirAPartida = function (codigo, nick) {
        this.nick = nick;
        this.socket.emit("unirAPartida", codigo, nick);
    }
    this.manoInicial=function () {
        this.socket.emit("manoInicial", this.nick);
    }
    this.jugarCarta=function(num){
		this.socket.emit("jugarCarta",this.nick,num);
	}
    this.robarCarta=function(num){
		this.socket.emit("robarCarta",this.nick,num);
	}
    this.pasarTurno=function(){
		this.socket.emit("pasarTurno",this.nick);
	}

    //Espera de respuestas, a la escucha (Zona servidor del clienteWS)
    this.servidorWSCliente = function () {
        var cli = this;
        this.socket.on("connect", function () {
            console.log("Conectado al servidor de WS");
        });
        this.socket.on("partidaCreada",function (datos) {
            console.log(datos);
            cli.codigo = datos.codigo;
        });
        this.socket.on("partidaCreada",function(data){
			console.log(data);
			cli.codigo=data.codigo;
			iu.mostrarCodigo(cli.codigo);
		});
        this.socket.on("unidoAPartida",function (datos) {
            console.log(datos);
            cli.codigo = datos.codigo;
        });
        this.socket.on("pedirCartas",function (data) {
            cli.manoInicial();
            //iu.mostrarPasarTurno();
			//iu.mostrarTablero();
			//iu.mostrarRobarCarta();
			//iu.mostrarAbandonarPartida();
			//$("#mSalir").remove();
        });
        this.socket.on("mano",function (data) {
            console.log(data);
            //iu.mostrarCartas(data);
        });
        this.socket.on("turno",function(data){
			console.log(data);
            //iu.mostrarCartaActual(data.cartaActual);
			//iu.mostrarTurno(data.turno);
		});
        this.socket.on("final", function(data){
			console.log(data);
		});
        this.socket.on("fallo",function(data){
			console.log(data);
		});
    }

    this.conectar();
}