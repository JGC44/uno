function ClienteRest() {
    this.agregarJugador=function(nick) {
        $.getJSON("/agregarJugador/"+nick,function(data) {
            //se ejecuta cuando conteste el servidor
            console.log(data);

            /*
            if(data.nick!=-1){
                ws.nick=data.nick;
                rest.obtenerListaPartidas(); //<--
               // iu.mostrarNick(data.nick);
                //iu.mostrarCrearPartida();
                //iu.mostrarUnirAPartida();
                
            }else{
                iu.mostrarModal("El nick "+nick+" está en uso.");
                iu.mostrarAgregarJugador();
            }
            */
        })
        //sigue la ejecucion sin esperar
        //mostrar un reloj, temporizado, cargando, etc
    }
    this.crearPartida=function(num,nick){
		$.getJSON("/crearPartida/"+num+"/"+nick,function(data){
			console.log(data);
            //ws.codigo=data.codigo;
            //iu.mostrarCodigo(data.codigo);
		})
	}
    
    this.unirAPartida=function(cod,nick){
		$.getJSON("/unirAPartida/"+cod+"/"+nick,function(data){
            console.log(data);
        })
    }
    
    this.obtenerListaPartidas=function(){
		$.getJSON("/obtenerListaPartidas",function(data){
			console.log(data);
            //iu.mostrarObtenerTodasPartidas(data);
		})
	}
    
    this.jugarCarta = function (nick, numero) {
        $.getJSON("/jugarCarta/" + nick +"/"+ numero, function (data) {
            console.log(data);
        });
    }

    this.robar = function (nick, numero) {
        $.getJSON("/robar/" + nick +"/"+ numero, function (data) {
            console.log(data);
        });
    }

    this.pasarTurno = function () {
        $.getJSON("/pasarTurno", function (data) {
            console.log(data);
        });
    }
}