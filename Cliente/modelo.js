function Juego(){
    this.usuarios={};
    this.partidas={};

    this.agregarJugador=function(nick){
        if (!this.usuarios[nick]){
            var jugador= new Jugador(nick,this);
            this.usuarios[nick]=jugador;
        }
        else{
            console.log("El nick está en uso");
        }
    }

    this.crearPartida=function(nick,numJug){
        var codigo="patata";
        var jugador=this.usuarios[nick];
        codigo=this.obtenerCodigo();
        while (this.partidas[codigo]){
            codigo=this.obtenerCodigo();
        };
        var partida=new Partida(codigo,jugador,numJug);
        this.partidas[codigo]=partida;

        return partida;
    }

    this.obtenerTodasPartidas=function(){
        var lista=[];

        for(each in this.partidas){
            var partida=this.partidas[each];
            lista.push({propietario:partida.propietario,codigo:each})
        }

        return lista;
    }

    this.unirAPartida=function(codigo,nick){
        if (this.partidas[codigo]){
            var jugador=this.usuarios[nick];
            this.partidas[codigo].unirAPartida(jugador);
        }
    }

    this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
        //return Date.now().toString();
	}

    this.numeroPartidas=function(){
		return Object.keys(this.partidas).length;
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}


function Jugador(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.mano=[];
    this.codigoPartida;
    this.turno=false;                               //new
    this.crearPartida=function(numJug){
        return this.juego.crearPartida(nick,numJug);
    }
    this.unirAPartida=function(codigo){
        this.juego.unirAPartida(codigo,nick);
    }
    this.robar=function(num){
        var partida=this.obtenerPartida(this.codigoPartida);
        var robadas=partida.dameCartas(num);
        //var tmp=this.mano;
        this.mano=this.mano.concat(robadas);
    }
    this.manoInicial=function(){
        var partida=this.obtenerPartida(this.codigoPartida);
        this.mano=partida.dameCartas(7);
    }
    this.obtenerPartida=function(codigo){
        return this.juego.partidas[codigo];
    }
    this.pasarTurno=function(){                     //new
        this.partida.pasarTurno();
    }
    this.jugarCarta=function(carta){                //new
        this.partida.jugarCarta(carta);
    }

}

function Partida(codigo,jugador,numJug){
    this.codigo=codigo;
    this.mazo=[];
    this.propietario=jugador.nick;
    this.numJug=numJug;
    this.jugadores={};
    this.listaJugadores=[];                         //new
    this.mesa=[];                                   //new
    this.fase=new Inicial();

    this.unirAPartida=function(jugador){
        this.fase.unirAPartida(this,jugador);
    }
    this.puedeUnirAPartida=function(jugador){
        this.jugadores[jugador.nick]=jugador;
        jugador.codigoPartida=this.codigo;
        this.listaJugadores.push(jugador.nick);     //new
    }
    this.numeroJugadores=function(){
		return Object.keys(this.jugadores).length;
	}
    this.crearMazo=function(){
        var colores=["azul","amarillo","verde","rojo"];
        for (i=0;i<colores.length;i++){
            this.mazo.push(new Numero(0,colores[i]));
        }
        for(j=0;j<colores.length;j++){
            for (i=1;i<10;i++){
                this.mazo.push(new Numero(i,colores[j]));
                this.mazo.push(new Numero(i,colores[j]));
            }
        }
        for(j=0;j<colores.length;j++){
            this.mazo.push(new Cambio(20,colores[j]));
            this.mazo.push(new Cambio(20,colores[j]));
        }
        for(j=0;j<colores.length;j++){
            this.mazo.push(new Bloqueo(20,colores[j]));
            this.mazo.push(new Bloqueo(20,colores[j]));
        }
        for(j=0;j<colores.length;j++){
            this.mazo.push(new Mas2(20,colores[j]));
            this.mazo.push(new Mas2(20,colores[j]));
        }
        for (i=1;i<5;i++){
            this.mazo.push(new Comodin(20));
            this.mazo.push(new Comodin4(20));
        }
    };

    this.asignarUnaCarta=function(){
        var maxCartas=this.mazo.length;
        var indice=randomInt(1,maxCartas)-1;
        var carta=this.mazo.splice(indice,1);
        return carta[0];
    }
    this.dameCartas=function(num){
        var cartas=[];
        for(i=0;i<num;i++){
            cartas.push(this.asignarUnaCarta());
        }
        return cartas;
    }

    //Calcula quien es el siguiente jugador y le asigna el turno
    this.pasarTurno=function(){                     //new
        var aux = this.listaJugadores.shift();      //cogemos y eliminamos el jugador inicial
        aux.turno = false;                          //asignamos a que no tenga el turno
        this.listaJugadores.push(aux);              //lo devolvemos al la lista de jugadores
        this.listaJugadores[0].turno = true;        //asignamos el turno al siguiente jugador
    }

    //asigna el turno inicial al primer jugador
    this.turnoInicial=function(){                       //new         
        this.propietario.turno=true;
    }

    //funcion auxiliar de jugarCarta()
    this.ponerEnJuego=function(carta){                  //new
        var aux = this.jugador.mano.splice(carta,1);
        this.mesa.push(aux);
    }

    //Controlamos que la carta se pueda jugar
    this.jugarCarta=function(carta){                    //new
        var last = this.mesa[this.mesa.length-1];       //ultima carta de la mesa (carta en juego)
        if ((carta == Comodin) || (carta == Comodin4)){
           this.ponerEnJuego(carta);
        }
        else if (last == Numero){
            if ((last.color == carta.color) || (last.valor == carta.valor)) {
                this.ponerEnJuego(carta);
            }
        }
        else if (last == Cambio){
            if ((last.color == carta.color) || (carta == Cambio)) {
                this.ponerEnJuego(carta);
            }
        }
        else if (last == Bloqueo){
            if ((last.color == carta.color) || (carta == Bloqueo)) {
                this.ponerEnJuego(carta);
            }
        }
        else if (last == Mas2){
            if ((last.color == carta.color) || (carta == Mas2)) {
                this.ponerEnJuego(carta);
            }
        }
        else {
            console.log("No se puede realizar la jugada, es ilegal");
        }
    }

    //Colocamos la carta inicial del juego
    this.cartaInicial=function(){                   //new
        this.mesa.push(this.asignarUnaCarta());
    }

    this.crearMazo();
    this.unirAPartida(jugador);
    this.turnoInicial();                            //new
    this.cartaInicial();                            //new

}

function Inicial(){
    this.nombre="inicial";
    this.unirAPartida=function(partida,jugador){
        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores()==partida.numJug){
            partida.fase=new Jugando();
        }
    }
}
function Jugando(){
    this.nombre="jugando";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha comenzado");
    }
}
function Final(){
    this.nombre="final";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ha terminado");
    }
}

function Numero(valor,color){
    this.tipo="numero";
    this.color=color;
    this.valor=valor;
}

function Cambio(valor,color){
    this.tipo="cambio";
    this.color=color;
    this.valor=valor;   
}

function Bloqueo(valor,color){
    this.tipo="bloqueo";
    this.color=color;
    this.valor=valor;    
}

function Mas2(valor,color){
    this.tipo="mas2";
    this.color=color;
    this.valor=valor;    
}

function Comodin(valor){
    this.tipo="comodin";
    this.valor=valor;
}

function Comodin4(valor){
    this.tipo="comodin4";
    this.valor=valor;
}