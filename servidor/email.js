//var sendgrid = require("sendgrid")("xxxxxx", "xxxxxx");

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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") //mirar discord

//var url = "http://127.0.0.1:5000/";
var url = "https://uno-jgc2.herokuapp.com/";


module.exports.enviarEmailConfirmacion = function(direccion, key){
    const msg = {
        to: direccion,
        from: 'jesus.gon.uno@gmail.com',
        subject: 'El juego del Uno: confirmación de correo',
        text: 'Haga clic en el enlace',
        html: '<p><a href="'+ url +'confirmarUsuario/'+direccion+'/'+key+'">Haz clic para confirmar</a></p>',
    }

    sgMail
    .send(msg)
    .then((response)=>{
        console.log(response[0].statusCode)
        console.log(response[0].headers)
    })
    .catch((error)=>{
    console.error(error)
    })
}
