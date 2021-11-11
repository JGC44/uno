function ControlWeb() {
    this.mostrarAgregarJugador = function () {
        var cadena = '<div id="mAJ"><label for="usr">Nick:</label>';
        cadena += '<input type="text" class="form-control" id="usr"></input>';
        cadena += '<button type="button" id="btnAJ" class="btn btn-primary">Entrar</button>';
        cadena += '</div>';

        /*
        var cadena = '<div id="mAJ">';
        cadena = cadena + '<div class="input-group mb-3"><input type="text" class="form-control" id="usr"></input>';
        cadena = cadena + '<div class="input-group-append"><button type="button" id="btnAJ" class="btn btn-primary">Entrar</button></div>';
        cadena = cadena + '</div></div>';
        */

        $("#agregarJugador").append(cadena);

        $("#btnAJ").on("click",function () {
            var nick=$("#usr").val();
            if (nick == "") {
                //si esta vacio
                alert('Necesita introducir un nick');
            }
            else {
                $("#mAJ").remove();
                $("#texto1").remove();
                rest.agregarJugador(nick);
                rest.obtenerTodasPartidas();
                //iu.mostrarNick(nick);
                //iu.mostrarCrearPartida();
                //iu.mostrarUnirAPartida();

            }
        });
    }

    //this.mostrarCrearPartida
    //this.mostrarUnirAPartida
    //this.mostrarListaPartidas

    this.mostrarCrearPartida = function () {
        var cadena = '<div id="mCP"><h5 id="texto1">Crear partida</h5>';
        cadena = cadena + '<div id="mCP"><label for="numJug">Numero de jugadores (2 a 8):</label></div>';
        cadena = cadena + '<div class="input-group mb-3"><input type="number" class="form-control" id="numJug"></input>';
        cadena = cadena + '<div class="input-group-append"><button type="button" id="btnCP" class="btn btn-primary">Crear</button></div>';
        cadena = cadena + '</div></div>';

        $("#crearPartida").append(cadena);

        $("#btnCP").on("click", function () {
            //click en crearPartida
            var numJug = $('#numJug').val();
            if (numJug == "") {
                alert('Necesita introducir el número de jugadores');
            }
            else if (numJug < 2 || numJug > 8) {
                $('#numJug').val("");
                alert('Introduzca un número entre 2-8 jugadores');
            }
            else {
                ws.crearPartida(numJug, nick);
                $("#mCP").remove();
                $("#mUAP").remove();
                $("#mOTP").remove();
                iu.paginaEspera();
            }
        })
    }
    this.mostrarCodigo = function (codigo) {
        var cadena = '<div id="mC"><label for="mostrarCodigo">Codigo de la partida: ' + codigo + '</label>';
        $("#mostrarCodigo").append(cadena);
    };

    this.paginaEspera = function(){
        //Esta funcion es para cuando una persona crea una partida
        //Y esta esperando a que gente se una
        var cadena = '<div id="pE"><h5 id="texto1">Esperando a los jugadores</h5>';
        cadena = cadena + '<br><div id="pE" class="spinner-border text-primary"></div>';
        
        $("#espera").append(cadena);
    }
    this.mostrarNick = function(nick){
        var cadena = '<div id="mN"><h4>Jugador</h4>';
        cadena = cadena + '<div id="mN"><label for="mostrarNick">Nick: ' + nick + '</label>';
        this.nick=nick;

        $("#mostrarNick").append(cadena);
    }

    //no se como hacer que se muestre el num
    /*this.mostrarNumJug = function(){
        var numJug= $('#numJug').val();
        var cadena = '<div id="mNJ"><label for="mostrarNumJug">Numero de jugadores:' + numJug +'</label> ';
        $("#mostrarNumJug").append(cadena);
    }*/


   
    this.mostrarUnirAPartida = function () {
        var cadena = '<div id="mUAP"><h5 id="texto2">Unir a partida</h5>';
        cadena = cadena + '<div id="mUAP"><label for="code">Introduzca el código de la partida:</label></div>';
        cadena = cadena + '<div class="input-group mb-3"><input type="text" class="form-control" id="code"></input>';
        cadena = cadena + '<div class="input-group-append"><button type="button" id="btnUAP" class="btn btn-primary">Unir</button></div>';
        cadena = cadena + '</div></div>';

        $("#unirAPartida").append(cadena);

        $("#btnUAP").on("click", function () {
            //click en mostrarPartida
            var code = $('#code').val();
            console.log(code);
            if (code == "") {
                alert('Necesita introducir el codigo de la partida');
            }
            else {
                ws.unirAPartida(code, nick);
                $("#mCP").remove();
                $("#mUAP").remove();
                $("#mOTP").remove();
                iu.paginaEspera();
                iu.mostrarCodigo(code);
            }
        })
    }

    this.mostrarCartas = function (lista){
        $("#espera").remove();
        $("#mCartas").remove();

        var cadena = '<div class="list-group" id="mCartas">';
        cadena = cadena + '<div class="card-columns">';
        
        for (i = 0; i < lista.length; i++) {
            cadena = cadena + '<div class="card bg-light" style="width:200px">';
            cadena = cadena + '<div class="card-body text-center">';
            cadena = cadena + '<a href="#" value="'+ i +'" class="list-group-item list-group-item-action">';
            cadena = cadena + '<img class="card-img-top" src="cliente/img/'+lista[i].nombre+'.png"></img>';
            cadena = cadena + '</a></div></div>';
        }

        cadena = cadena + '</div></div></div>';

        $("#mano").append(cadena);

        $(".list-group a").click(function () {
            var number=-1;
            number = $(this).attr("value");
            if (number!=-1) {
                ws.jugarCarta(number);
            }
        })
    }

    this.mostrarTurno = function (nickTurno) {
        $("#mTurno").remove();

        var cadena = '<div id="mTurno"><h6>Turno: </h6>' + nickTurno +'</div>';

        $("#mostrarTurno").append(cadena);
    };

    this.mostrarPasarTurno = function () {
        var cadena = '<div id="mPT"><button type="button" id="btnPT" class="btn btn-dark">Pasar turno</button>';

        $("#pasarTurno").append(cadena);

        $("#btnPT").on("click", function () {
            ws.pasarTurno();
        })

    };

    this.mostrarCartaActual=function(carta){

        $("#mCA").remove();

        var cadena ='<div class="card-columns" id="mCA">';
        
            cadena = cadena + '<div class="card bg-light">';
            cadena = cadena + '<div class="card-body text-center">';
            cadena = cadena + '<p class="card-text"><span style="font-weight:bold">CARTA ACTUAL</span><br>Tipo: '+carta.tipo+'<br>Color: '
            +carta.color+'<br>Valor: '+carta.valor+'</p>';
            cadena = cadena + '</div></div>';

        cadena = cadena + '</div>';

        $("#cartaActual").append(cadena);
    }
    this.mostrarTablero = function(){
        var tabl = '<div id="mTABLERO"><h1>TABLERO UNO</h1></div>';
        $("#tablero").append(tabl);
    }

    //falta mostrarRobarCarta, mostrarSalir, mostrarAbandonarPartida
   
    this.mostrarObtenerTodasPartidas = function(lista){
        $("#mOTP").remove();

        var cadena = '<div id="mOTP"><h5>Partidas disponibles:</h5>';
        cadena = cadena + '<ul class="list-group">';
        for (i = 0; i < Object.keys(lista).length; i++) {
            cadena = cadena + '<a href="#" class="list-group-item list-group-item-action" value="' + lista[i].codigo + '">Codigo: ' + lista[i].codigo + ' || Dueño: ' + lista[i].propietario + '</a>';
        }
        cadena = cadena + '</ul>';
        cadena = cadena + '</div>';

        $("#listaPartidas").append(cadena);

        $(".list-group a").click(function () {
            code = $(this).attr("value");
            var nick = ws.nick;
            console.log(code + " " + nick);
            if (code && nick) {
                ws.unirAPartida(code, nick);
                $("#mCP").remove();
                $("#mUAP").remove();
                $("#mOTP").remove();
                iu.paginaEspera();
                iu.mostrarCodigo(code);
            }
        })
    }
    
    this.mostrarModal=function(msg){
        $("#mM").remove();
        var cadena = '<p id="mM">'+msg+'</p>';
        $("#contenidoModal").append(cadena);
        $('#myModal').modal('show');
    }
}