var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function CAD() {
    this.resultadosCol = undefined;
    this.usuariosCol = undefined;

    //Metodos publicos
    this.encontrarTodosResultados = function (callback) {
        encontrarTodos(this.resultadosCol, callback);
    }

    this.encontrarTodosUsuarios = function (callback) {
        encontrarTodos(this.usuariosCol, callback);
    }

    this.encontrarUsuarioCriterio = function (criterio, callback) {
        encontrarCriterio(this.usuariosCol, criterio, callback);
    }

    this.insertarUsuario = function(usuario,callback){
        insertar(this.usuariosCol,usuario,callback);
    }

    this.encontrarResultadoCriterio = function (criterio, callback) {
        encontrarCriterio(this.resultadosCol, criterio, callback);
    }

    function encontrarCriterio(coleccion, criterio,callback){
        coleccion.find(criterio).toArray(function(err,usr){
            if (usr.length==0){
                callback(undefined);
            }
            else{
                callback(usr[0]);
            }
        })
    }


    function encontrarTodos(collection, callback) {
        collection.find().toArray(function (err, datos) {
            if (err) {
                callback([]);
            } else {
                callback(datos);
            }
        })
    }

    this.insertarResultado = function (resultado, callback) {
        insertar(this.resultadosCol, resultado, callback);
    }

    function insertar(collection, objeto, callback) {
        collection.insertOne(objeto, function (err, resultado) {
            if (err) {
                console.log("No se ha podido insertar elementos");
            } else {
                console.log("Nuevo elemento");
                callback(resultado);
            }
        })
    }

    //Metodos de las colecciones
 
    this.modificarColeccionUsuarios=function(usuarios,callback){
        modificarColeccion(this.usuariosCol,usuarios,callback)
    }

    function modificarColeccion(coleccion, usr, callback){
        coleccion.findOneAndUpdate({ _id: usr._id }, {$set:usr}, {upsert:false}, function (err, result) {
            if (err) {
                console.log("No se pudo actualizar la colección (método genérico)");
            }
            else {
                console.log("Elemento actualizado");
                // console.log(result);
            }
            callback(result);
        });
    }

    this.conectar = function (callback) {
        var cad = this;
        mongo.connect("mongodb+srv://patata:patata@cluster0.0ch8k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", function (err, db) {
            if (err) {
                console.log("No se puede conectar")
            }
            else {
                console.log("Conectando a Atlas MongoDB")
                cad.resultadosCol = db.db("unoDB1").collection("resultados");  //CAD con mayuscula?
                //cad.usuariosCol = db.db("unoDB1").collection("usuarios");
            }
        })
    }

    function encontrarCriterio(coleccion, criterio,callback){
        coleccion.find(criterio).toArray(function(err,usr){
            if (usr.length==0){
                callback(undefined);
            }
            else{
                callback(usr[0]);
            }
        })
    }

    this.eliminarUsuario = function (uid, callback){
        this.eliminar(this.usuariosCol, {_id:ObjectId(uid)}, callback);
    }
    
    this.eliminar=function(coleccion,criterio, callback){
        coleccion.deleteOne(criterio,function(err,result){
            if(err){
                console.log("No se ha podido eliminar el usuario");
            }
            else{
                console.log("Usuario eliminado");
                callback(result);
            }
        });    
    }


}



module.exports.CAD = CAD;