function ClienteRest() {
    this.agregarJugador=function(nick) {
        $.getJSON("/agregarJugador/"+nick,function(data) {
            //se ejecuta cuando conteste el servidor
            console.log(data);
        })
        //sigue la ejecucion sin esperar
        //mostrar un reloj, temporizado, cargando, etc
    }
    this.crearPartida=function(num,nick){
		$.getJSON("/crearPartida/"+num+"/"+nick,function(data){
			console.log(data);
		})
	}
    
    this.unirAPartida=function(cod,nick){
		$.getJSON("/unirAPartida/"+cod+"/"+nick,function(data){
            console.log(data);
        })
    }
    
}