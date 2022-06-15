function ControlWeb() {
    //para la vista
    //Cookies
    this.comprobarUsuario = function () {
        if ($.cookie("nick")){
            ws.nick=$.cookie("nick");
            iu.mostrarHome({nick:ws.nick});
        }else{
            iu.mostrarLogin();
            //iu.mostrarAgregarJugador();
        }
    }
    /*
    this.comprobarUsuario=function(){
        if ($.cookie("nick")){
            rest.comprobarUsuario($.cookie("nick"));
        }
        else{
            iu.mostrarLogin();
        }
    }
    */

    this.mostrarHome= function(data){
        iu.mostrarAbandonarJuego();
        iu.mostrarControl(data.nick)
        iu.mostrarCrearPartida(data.nick);
        rest.obtenerPartidasDisponibles();
    }

    this.limpiarSignup= function(data){
        $("#signup").remove();
    }

    this.mostrarRegistro=function(){
		$('#signup').load("/cliente/signup.html",function(){
			$("#btnSU").on("click",function(e){
				if ($('#email').val() === '' || $('#password').val()==='') {
				    e.preventDefault();
				    //alert('introduce un nick');
				}
				else{
					var email=$('#email').val();
					var pass=$('#password').val();
					rest.registrarUsuario(email,pass);
				}
			})
			$("#si").on("click",function(){
				iu.mostrarLogin();
			})
		});
	}

	this.mostrarLogin=function(aviso){
		$('#signup').load("/cliente/signin.html",function(){
			if (aviso){
				$("#info span").text("Usuario o clave incorrectos");
			}
			$("#btnSI").on("click",function(e){
				if ($('#email').val() === '' || $('#password').val()==='') {
				    e.preventDefault();
				    //alert('introduce un nick');
				}
				else{
					var email=$('#email').val();
					var pass=$('#password').val();
					//$("#mAJ").remove();
					//$("#aviso").remove();
					rest.loginUsuario(email,pass);
				}
			});
			$("#reg").on("click",function(){
				iu.mostrarRegistro();
			})
		});
	}

    //AGREGAR JUGADOR
    
    this.mostrarTexto = function () {
        var cadena = '<div id = "mT">'
        cadena += '<p> Introduce tu nick para comenzar a jugar </p>'
        cadena += '</div>'
        $("#mostrarTexto").append(cadena);
    }

    this.mostrarAgregarJugador = function () {
        iu.mostrarTexto();
        $('#mLP').remove()
        //meter el html en una cadena 
        //<label for="usr">Nick:</label>
        var cadena = '<div id = "mAJ">';
        cadena += '<input type="text" class="form-control" placeholder="Su nick" id="usr"></input>';
        cadena += '<button type="button" id="btnAJ" class="btn btn-success">Entrar</button>'
        cadena += "</div>"

        //selector que busca aquel elemento html cuyo id sea el que se indica (si pones . en vez de # buscaria clases)
        $("#agregarJugador").append(cadena);
        $("#btnAJ").on("click", function () {
            //codigo que controla el click sobre el boton cuyo id es btnAJ
            var nick = $('#usr').val();

            if (nick == "") {
                iu.mostrarModal("Debes introducir un Nick")
            } else {
                $("#mAJ").remove(); //que desaparezca el formulario despues de introducir el nick
                $("#mT").remove();
                rest.agregarJugador(nick);
            }
        })
    }
    
    /*
    this.mostrarAgregarJugador=function(){
		var cadena='<form class="form-row needs-validation"  id="mAJ">';
		cadena=cadena+'<div class="col">'
        //cadena=cadena+'<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
        cadena=cadena+'<div class="col">';
        //cadena=cadena+'<button id="btnAJ" class="btn btn-primary mb-2 mr-sm-2">Entrar</button>';
        cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
        cadena=cadena+'</div></form>';

		$("#agregarJugador").append(cadena);     
		$("#nota").append("<div id='aviso' style='text-align:right'>Inicia sesión con Google para jugar</div>");    

		$("#btnAJ").on("click",function(e){
			if ($('#usr').val() === '' || $('#usr').val().length>6) {
			    e.preventDefault();
			    //alert('introduce un nick');
			}
			else{
				var nick=$('#usr').val();
				$("#mAJ").remove();
				$("#aviso").remove();
				rest.agregarJugador(nick);
			}
		})
	}
    */

    /*
    this.mostrarEsperando=function(){
		$('#spin').remove();
		var cadena='<div class="d-flex justify-content-center" id="spin">';
		cadena=cadena+'<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';
		cadena=cadena+"</div>";
		$('#esperando').append(cadena);
	}
	this.quitarEsperando=function(){
		$('#spin').remove();
	}
    */
    this.mostrarSalirPartida = function () {
        var cadena = '<div id = "mSP">'
        cadena += '<button type="button" id="btnSP" class="btn btn-danger">Salir</button>'
        cadena += '</div>'
        $('#salir').append(cadena);

        $("#btnSP").on("click", function () {

            //ws.nick = "";
            ws.codigo = "";
            $("#mM").remove();
            $("#mCA").remove();
            $("#mCP").remove();
            $("#mEsp").remove();
            $("#mLP").remove();
            $('#mTur').remove();
            $('#mCod').remove();
            $('#mR').remove();
            $("#btnSP").remove();
            $('#mCon').remove();
            $('#btnAbJ').remove();

            iu.mostrarAbandonarJuego();
            iu.mostrarControl(ws.nick);
            iu.mostrarCrearPartida(ws.nick);
            rest.obtenerPartidasDisponibles();
        })
    }

    this.mostrarAbandonarJuego = function () {
        var cadena = '<div id = "mAbJ">'
        cadena += '<button type="button" id="btnAbJ" class="btn btn-danger">Abandonar juego</button>'
        cadena += '</div>'
        $('#abandonar').append(cadena);

        $("#btnAbJ").on("click", function () {
            ws.codigo = "";
            ws.nick = "";
            $("#mCP").remove();
            $("#mLP").remove();
            $('#mCon').remove();
            $('#btnAbJ').remove();
            $("#mM").remove();
            $("#mCA").remove();
            $("#mEsp").remove();
            $('#mTur').remove();
            $('#mCod').remove();
            $('#mR').remove();
            $("#btnSP").remove();

            //limpiarTodo
            iu.mostrarLogin();
        })
    }

    //mostrarTurno
    this.mostrarTurno = function (nick) {
        $('#mTur').remove();
        //var cadena = '<div id="mTur">'
        var cadena = '<div id="mTur" class="card-body text-center">'
        //cadena += '<p class="card-text">Turno </p>' + nick;
        cadena += '<h6>Turno: </h6>' + nick;
        cadena += '</div>'

        $('#turno').append(cadena);
    }

    //CREAR PARTIDA
    this.mostrarCrearPartida = function (nick) {
        //iu.mostrarSalirPartida(); 
        //necesita el nick y el numJug
        var cadena = '<div id = "mCP"><h3 class="text-center">Crear Partida</h3>';
        cadena += '<label for="numJug">Numero de jugadores:</label>'
        cadena += '<select class="form-control" id="numJug">'
        cadena += '<option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option>'
        cadena += "</select>"
        cadena += '<button type="button" id="btnCP" class="btn btn-success">Crear partida</button>'
        cadena += "</div>"

        $("#crearPartida").append(cadena);
        $("#btnCP").on("click", function () {
            var numJug = $('#numJug').val();
            $("#mCP").remove();
            //iu.mostrarEsperando(); 
            $('#mLP').remove();
            ws.crearPartida(nick, numJug);
            $('#mAbJ').remove();
            iu.mostrarSalirPartida();
        })
    }

    this.mostrarEsperando = function () {
        var cadena = '<div id=mEsp>'
        cadena += '<button class="btn btn-primary" disabled>'
        cadena += '<span class="spinner-grow spinner-grow-sm"></span>  Esperando jugadores  </button>'
        cadena += '</div>'
        $("#esperando").append(cadena);
    }

    this.mostrarCodigo = function (codigo) {
        var cadena = '<div id="mCod">'
        cadena += "Codigo: " + codigo;
        cadena += '</div>'
        $('#mostrarCodigo').append(cadena);
    }

    this.mostrarControl = function (nick) {
        var cadena = '<div id="mCon">'
        cadena += "Jugador: " + nick;
        cadena += '</div>'
        $('#mostrarControl').append(cadena);
    }

    //LISTA PARTIDAS (Aqui se une a la partida)
    this.mostrarListaPartidas = function (lista) {

        $('#mLP').remove() //borrar el formulario
        var cadena = '<div class="list-group" id="mLP"><h3 class="text-center">Lista Partidas</h3>'

        for (i = 0; i < lista.length; i++) {
            var codigo = lista[i].codigo
            cadena += ' <a href="#" class="list-group-item list-group-item-action" value ="' + codigo + '">' + codigo + '</a>';
        }

        cadena += '</div>';

        $('#listaPartidas').append(cadena);

        $(".list-group a").click(function () {
            codigo = $(this).attr("value");
            var nick = ws.nick;
            console.log(codigo + "" + nick);
            if (codigo && nick) {
                //$('#mLP').remove(); 
                $('#mCP').remove();
                iu.mostrarCodigo(codigo);
                ws.unirAPartida(codigo, nick);
                $('#mLP').remove();
                $('#mSP').remove();
                //iu.mostrarTurno();
                $('#mAbJ').remove();
                iu.mostrarSalirPartida();
            }
        });
    }

    this.mostrarModal = function (msg) {
        //meter el msg en el modal (usar el mismo modal para muchas cosas)
        $('#cM').remove();
        var cadena = "<p id='cM'>" + msg + "</p>";
        $('#contenidoModal').append(cadena);
        $("#miModal").modal('show');
    }

    //new
    this.mostrarCambioColor = function (number) {
        $('#mMC').remove();
        var cadena = '<div id="mMC" class ="card bg-light">';
        cadena += '<p> Selecciona a que color cambiar </p>';
        cadena += '<div id="" class="btn-group">';
        cadena += '<button type="button" id="btnAzul" class="btn btn-primary">Azul</button>';
        cadena += '<button type="button" id="btnVerde" class="btn btn-success">Verde</button>';
        cadena += '<button type="button" id="btnAmarillo" class="btn btn-warning">Amarillo</button>';
        cadena += '<button type="button" id="btnRojo" class="btn btn-danger">Rojo</button>';
        cadena += '</div>';
        cadena += '</div>';
        
        $('#cambioColor').append(cadena);

        //on-click
        $("#btnAzul").on("click", function () {
            var color = "azul";
            ws.colorComodin(number,color);
            $('#mMC').remove();
            ws.jugarCarta(number);
        })
        $("#btnVerde").on("click", function () {
            var color = "verde";
            ws.colorComodin(number,color);
            $('#mMC').remove();
            ws.jugarCarta(number);
        })
        $("#btnAmarillo").on("click", function () {
            var color = "amarillo";
            ws.colorComodin(number,color);
            $('#mMC').remove();
            ws.jugarCarta(number);
        })
        $("#btnRojo").on("click", function () {
            var color = "rojo";
            ws.colorComodin(number,color);
            $('#mMC').remove();
            ws.jugarCarta(number);
        })
    }


    this.mostrarMano = function (lista) {
        $('#mM').remove();
        //console.log(lista); 
        var cadena = '<div id="mM" class="card-columns">';
        //var cadena = '<div class="list-group" id="mM">';
        cadena += '<div class="card-columns">'
        
        for (i = 0; i < lista.length; i++) {
            var carta = lista[i].nombre;
            cadena += '<div class ="card bg-light">'
            //cadena += '<div class="card-body text-center">'
            cadena += '<a href="#" value="' + i + '" nombre="' + carta + '" class="list-group-item list-group-item-action">';
            cadena += '<img class="card-img-top" src="/cliente/img/cartas/'+ carta +'.png" alt="Card image" style="width:50px;">'
            //cadena += '<p class="card-text">' + lista[i].tipo + ' ' + lista[i].color + ' ' + lista[i].valor + '</p>';
            cadena += '</div>';
        }

        cadena += '</div>';
        $('#mano').append(cadena);

        //on click
        $(".card-columns a").click(function () {
            var number = -1;
            var nombre = "a";
            number = $(this).attr("value");
            nombre = $(this).attr("nombre");
            if (number != -1) {
                if (nombre == "comodin" || "comodin4") {
                    //ws.checkComodin(number)
                    iu.mostrarCambioColor(number)
                } //else {
                    //iu.mostrarCambioColor(number)
                    ws.jugarCarta(number);
                //}
            }
        })
    }

    

    this.mostrarRobar = function () {
        var cadena = '<div id="mR"><button type="button" id="btnR" class="btn btn-primary">Robar</button>';

        $("#robar").append(cadena);

        $("#btnR").on("click", function () {
            ws.robarCarta(1);
        })

    };


    this.mostrarCartaActual = function (carta) {
        $('#mCA').remove();
        $('#mEsp').remove();
        $('#mLP').remove();
        var cadena = '<div id="mCA" class="card-columns">';

        //cadena += '<div class ="card bg-light">'
        //cadena += '<div class="card-body text-center">'
        cadena += '<img class="card-img-top" src="/cliente/img/cartas/'+carta.nombre +'.png" alt="Card image" style="width:50px;">'
        //cadena += '<p class="card-text">' + carta.tipo + ' ' + carta.color + ' ' + carta.valor + '</p>';
        //cadena += '</div></div>';

        cadena += '</div>';
        $('#actual').append(cadena);
    }
    /*
    this.mostrarRivales=function(data){
        $('#mLR').remove();
        var cadena="<div id='mLR'><h3>Rivales:</h3>";
        for(i=0;i<data.length;i++){
            if (data[i]!=ws.nick){
                cadena=cadena+'<div class="card">';
                    cadena=cadena+'<div class="card-body">';
                cadena=cadena+'<p class="card-title">Rival:</p>';
                cadena=cadena+'<p class="card-text">Nick: '+data[i]+'</p>';
                //cadena=cadena+'<a href="#" class="btn btn-primary">Otros</a>';
                    cadena=cadena+'</div></div>';
                }
        }
        $('#rivales').append(cadena);
    */
    /*
    this.limpiar=function(){
        $('#mAJ').remove();
        $('#mC').remove();
        $('#mCP').remove();
        $('#mLP').remove();
        $('#spin').remove();
        $('#cartas').remove();
        $('#carta2').remove();
        $('#cartas2').remove();
        $('#carta').remove();
        $('#mLR').remove();
        $('#miTurno').remove();
        $('#mR').remove();
        $('#mUcC').remove();
        $('#mMQ1').remove();
        $('#abandonar').remove();
        $('#salir').remove();
    }
    */
    /*
    this.limpiarAbandonar=function(){
        $('#mAJ').remove();
        $('#mC').remove();
        $('#mCP').remove();
        $('#mLP').remove();
        $('#spin').remove();
        $('#cartas').remove();
        $('#carta2').remove();
        $('#cartas2').remove();
        $('#carta').remove();
        $('#mLR').remove();
        $('#miTurno').remove();
        $('#mR').remove();
        $('#mUcC').remove();
        $('#abandonar').remove();
        $('#mMQ1').remove();
    }
    */
}