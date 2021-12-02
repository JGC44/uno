function ControlWeb() {
    //para la vista

    //Cookies
    this.comprobarUsuario = function () {
        if ($.cookie("nick")) {
            ws.nick = $.cookie("nick");
            //iu.mostrarHome({nick:ws.nick});
            iu.mostrarLobby();
        } else {
            iu.mostrarAgregarJugador();
        }

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
            $("#mEs").remove();
            $("#mLP").remove();
            $('#mTur').remove();
            $('#mCod').remove();
            $('#mR').remove();
            $("#btnSP").remove();
            $('#mCon').remove();

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
            iu.mostrarAgregarJugador();
        })
    }

    //mostrarTurno
    this.mostrarTurno = function (nick) {
        $('#mTur').remove();
        var cadena = '<div id="mTur">'
        // cadena += '<div class="card-body text-center">'
        // cadena += '<p class="card-text">Turno</p>';
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
        var cadena = '<div id=mEs>'
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

    this.mostrarMano = function (lista) {
        $('#mM').remove();
        //console.log(lista); 


        var cadena = '<div class="list-group" id="mM">';
        cadena += '<div class="card-columns">'

        for (i = 0; i < lista.length; i++) {
            var carta = lista[i].img + ".png"
            cadena += '<div class ="card bg-light">'
            cadena += '<div class="card-body text-center">'
            cadena += '<a href="#" value="' + i + '" class="list-group-item list-group-item-action">';
            cadena += '<p class="card-text">' + lista[i].tipo + ' ' + lista[i].color + ' ' + lista[i].valor + '</p>';
            cadena += '</div></div>';
        }

        /*
                var cadena = '<div id="mM" class="card-columns row">'
                
                for (var i = 0; i<lista.length; i++) {
                    var carta = lista[i].img+".png"
                    cadena += `
                    <div id="`+i+`" class="cardcol pb-1 mb-2 misCartas">
                        <a onclick="ws.jugarCarta(`+i+`)"><img class="card-img border border-dark" src="/cliente/img/cartas`+carta+`" alt=""></a>
                    </div>`
                }
        */

        cadena += '</div>';
        $('#mano').append(cadena);

        //on click
        $(".list-group a").click(function () {
            var number = -1;
            number = $(this).attr("value");
            if (number != -1) {
                ws.jugarCarta(number);

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

    //abandonar partida

    this.mostrarCartaActual = function (carta) {
        $('#mCA').remove();
        $('#mEs').remove();
        $('#mLP').remove();
        var cadena = '<div id="mCA" class="card-columns">';

        cadena += '<div class ="card bg-light">'
        cadena += '<div class="card-body text-center">'
        //cadena += '<img class="card-img-top" src="cliente/img/'+carta.nombre +'.png" alt="Card image">'
        cadena += '<p class="card-text">' + carta.tipo + ' ' + carta.color + ' ' + carta.valor + '</p>';
        cadena += '</div></div>';

        cadena += '</div>';
        $('#actual').append(cadena);
    }
    /*
    his.mostrarRivales=function(data){
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
    this.limpiar = function () {
        $("#mT").remove();
        $("#mAJ").remove();
        $("#btnAJ").remove();
        $("#mSP").remove();
        $("#btnSP").remove();
        $("#mAbJ").remove();
        $("#mTur").remove();
        $("#mCP").remove();
        $("#mEs").remove();
        $("#mCod").remove();
        $("#mCon").remove();
        $('#mLP').remove();
        $('#cM').remove();
        $('#mM').remove();
        $('#mR').remove();
        $('#mCA').remove();
    }
    */
}