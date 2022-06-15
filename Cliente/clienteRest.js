function ClienteRest() {
    //new
    this.registrarUsuario=function(email,clave){
		$.ajax({
			type:'POST',
			url:'/registrarUsuario',
			data:JSON.stringify({"email":email,"clave":clave}),
			success:function(data){
				if (data.email){
					//mostrarLogin
					console.log("Registro con exito: " + data.email);
				}
				else{
					iu.mostrarModal("No se ha podido registrar");
				}
			},
			contentType:'application/json',
			dataType:'json'
		});
	}

    this.loginUsuario = function (email, clave) {
        $.ajax({
            type: 'POST',
            url: '/loginUsuario',
            data: JSON.stringify({ "email": email, "clave": clave }),
            success: function (data) {
                if (data.nick != "nook") {
                    console.log("Inicio de sesion exitoso: " + data.email);
                    ws.nick = data.nick;
                    $.cookie("nick",data.nick);
                    iu.limpiarSignup()
                    iu.mostrarHome(data);

                } else {
                    console.log(data);
                    console.log("Usuario  o clave incorrecta");
                    iu.mostrarModal("Usuario o clave incorrecta");
                    iu.mostrarLogin();
                }
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    };

    this.agregarJugador = function (nick) {
        var cli = this;
        $.getJSON("/agregarJugador/" + nick, function (data) {
        //$.getJSON("/auth/google", function (data) {
            //se ejecuta cuando contesta el servidor
            console.log(data);

            if (data.nick != -1) {
                ws.nick = data.nick;
                $.cookie("nick",ws.nick);
                iu.mostrarHome(data);
                /*
                iu.mostrarAbandonarJuego();
                iu.mostrarControl(data.nick)
                iu.mostrarCrearPartida(data.nick);
                rest.obtenerPartidasDisponibles();
                */
            } else {
                iu.mostrarModal("El nick " + nick + " ya está en uso.");
                iu.mostrarAgregarJugador()
            }
        })
        //sigue la ejecución sin esperar
        //mostrar un reloj, temporizado, cargando, etc
    }
    /*
    //new
    this.eliminarUsuario=function(clave){
		var nick=$.cookie("nick");
		$.ajax({
			type:"DELETE",
			url:"/eliminarUsuario/"+nick,
			data:{clave:clave},
			success:function(data){
				if (data.res==1){
					$.removeCookie("nick");
					iu.limpiar();
					iu.mostrarLogin();
				}
				else{
                    iu.limpiar();
					console.log("No se pudo eliminar usuario");
                    iu.mostrarPerfil();
				}
			},
			//contentType:"application/json",
			dataType:"json"
		});
	}
    */

    this.comprobarUsuario=function(nick){
        $.getJSON("/comprobarUsuario/"+nick,function(data){
            console.log(data);
            if (data=="nook"){
                $.removeCookie("nick")
            }
            else{
                ws.nick=$.cookie("nick");            
                iu.mostrarHome({nick:ws.nick});
                rest.obtenerPartidasDisponibles();
            }
        })
    }

    this.crearPartida = function (nick, numJ) {
        $.getJSON("/crearPartida/" + nick + "/" + numJ, function (data) {
            console.log(data);
            ws.codigo=data.codigo;
            iu.mostrarCodigo(data.codigo);
        })
    }

    this.unirAPartida = function (codigo, nick) {
        $.getJSON("/unirAPartida/" + codigo + "/" + nick, function (data) {
            console.log(data);
            iu.mostrarMano();
        })
    }

    //obtenerlistapartidas
    this.obtenerTodasPartidas = function () {
        $.getJSON("/obtenerTodasPartidas", function (data) {
            console.log(data);
            //iu.mostrarObtenerTodasPartidas(data);
            iu.mostrarListaPartidas(data);
        })
    }

    this.obtenerPartidasDisponibles = function () {
        $.getJSON("/obtenerPartidasDisponibles", function (data) {
            console.log(data);
            iu.mostrarListaPartidas(data)
        })
    }

    
    this.jugarCarta = function (nick, numero) {
        $.getJSON("/jugarCarta/" + nick + "/" + numero, function (data) {
            console.log(data);
        });
    }

    this.robarCarta = function (nick, numero) {
        $.getJSON("/robarCarta/" + nick + "/" + numero, function (data) {
            console.log(data);
        });
    }

    this.meQuedaUna = function (nick, numero) {
        $.getJSON("/meQuedaUna/" + nick + "/" + numero, function (data) {
            console.log(data);
        });
    }

    this.pasarTurno = function () {
        $.getJSON("/pasarTurno", function (data) {
            console.log(data);
        });
    }

    
    this.mostrarJuego = function () {
        $.getJSON("/mostrarJuego", function (data) {
            console.log(data);
        });
    }

    this.mostrarControl = function (data, num) {
        $('#mC').remove();
        var cadena = '<div id="mC"><h4>Jugador<h4>';
        cadena = cadena + '<p>Nick: ' + data.nick + '<p>';
        cadena = cadena + '</div>';
    }
    

    //new (BBDD)
    this.obtenerTodosResultados = function () {
        $.getJSON("/obtenerTodosResultados", function (data) {
            console.log(data);
            //iu.todosResultados(data);
            //iu.mostrarVolver();
            //iu.mostrarListaResultados(data);
        })
    }

    this.obtenerResultados = function (nick) {
        $.getJSON("/obtenerResultados/" + nick, function (data) {
            console.log(data);
            //iu.mostrarListaResultados(data);
        })
    }

    this.abandonarPartida = function(nick){
        $.getJSON("/abandonarPartida/" + nick, function (data) {
            console.log(data);
        });
    }
    
    this.cerrarSesion=function(){
		$.getJSON("/cerrarSesion",function(data){
			console.log(data);			
			//iu.mostrarAgregarJugador();
			//iu.mostrarListaResultados(data);
		})
	}
}