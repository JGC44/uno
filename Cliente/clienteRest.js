function ClienteRest() {
    this.agregarJugador = function (nick) {
        $.getJSON("/agregarJugador/" + nick, function (data) {
            //se ejecuta cuando contesta el servidor
            console.log(data);

            if (data.nick != -1) {
                ws.nick = data.nick;
                // $.cookie("nick",data.nick);
                iu.mostrarAbandonarJuego();
                iu.mostrarControl(data.nick)
                iu.mostrarCrearPartida(data.nick);
                rest.obtenerPartidasDisponibles();
            } else {
                iu.mostrarModal("El nick " + nick + " ya está en uso.");
                iu.mostrarAgregarJugador()
            }
        })
        //sigue la ejecución sin esperar
        //mostrar un reloj, temporizado, cargando, etc
    }

    this.crearPartida = function (nick, numJ) {
        $.getJSON("/crearPartida/" + nick + "/" + numJ, function (data) {
            console.log(data);
        })
    }

    this.unirAPartida = function (codigo, nick) {
        $.getJSON("/unirAPartida/" + codigo + "/" + nick, function (data) {
            console.log(data);
            iu.mostrarMano();
        })
    }

    this.obtenerTodasPartidas = function () {
        $.getJSON("/obtenerTodasPartidas", function (data) {
            console.log(data);
            iu.mostrarListaPartidas(data);
        })
    }

    this.obtenerPartidasDisponibles = function () {
        $.getJSON("/obtenerPartidasDisponibles", function (data) {
            console.log(data);
            iu.mostrarListaPartidas(data)
        })
    }

    ////
    this.jugarCarta = function (nick, numero) {
        $.getJSON("/jugarCarta/" + nick +"/"+ numero, function (data) {
            console.log(data);
        });
    }

    this.robarCarta = function (nick, numero) {
        $.getJSON("/robarCarta/" + nick +"/"+ numero, function (data) {
            console.log(data);
        });
    }

    this.pasarTurno = function () {
        $.getJSON("/pasarTurno", function (data) {
            console.log(data);
        });
    }

    this.mostrarJuego = function(){
        $.getJSON("/mostrarJuego",function(data){
            console.log(data);
        });
    }
    
    this.mostrarControl=function(data,num){
        $('#mC').remove();
        var cadena = '<div id="mC"><h4>Jugador<h4>';
        cadena=cadena+'<p>Nick: '+data.nick+'<p>';
        cadena=cadena+'</div>';
    }
    ////

    this.obtenerTodosResultados = function () {
        $.getJSON("/obtenerTodosResultados", function (data) {
            console.log(data);
            //iu.mostrarListaResultados(data);
        })
    }

    this.obtenerResultados = function (nick) {
        $.getJSON("/obtenerResultados/"+nick, function (data) {
            console.log(data);
            //iu.mostrarListaResultados(data);
        })
    }

    this.registrarUsuario=function(email,clave){
		$.ajax({
			type:'POST',
			url:'/registrarUsuario',
			data:{"email":email,"clave":clave},
			success:function(data){
				if (data.email){
					//mostrarLogin
					console.log(data.email);
				}
				else{
					console.log("No se ha podido registrar")
				}
			},
			//contentType:'application/json',
			dataType:'json'
		});
    }
}