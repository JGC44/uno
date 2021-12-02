var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function CAD() {
    this.resultadosCol = undefined;

    //Metodos publicos
    this.encontrarTodosResultados = function (callback) {
        encontrarTodos(this.resultadosCol, callback);
    }

    this.encontrarResultadoCriterio = function (criterio, callback) {
        encontrarCriterio(this.resultadosCol, criterio, callback);
    }

    function encontrarCriterio(collection, criterio, callback) {
        collection.find(criterio).toArray(function (err, col) {
            if (err) {
                callback([]);
            } else {
                callback(col);
            }
        })
    }

    //Metodos privados
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
 
    this.conectar = function (callback) {
        var cad = this;
        mongo.connect("mongodb+srv://patata:patata@cluster0.0ch8k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", function (err, db) {
            if (err) {
                console.log("No se puede conectar")
            }
            else {
                console.log("Conectando a Atlas MongoDB")
                cad.resultadosCol = db.db("unoDB1").collection("resultados");  //CAD con mayuscula?
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

    //
}

module.exports.CAD = CAD;