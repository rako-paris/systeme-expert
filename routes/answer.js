var express 		= require('express');
var router 			= express.Router();

var http            = require('http');
var request         = require('request');
var config          = require('../config/config');
var questions       = require('./../questions.json');




//reécupération des questions toutes les 15secondes
var requestLoop = setInterval(function(){
  requestQuestion();
}, 30000);




  var requestQuestion = function(){
    request({
        url: "http://localhost:7000/api/home/getQuestionSI",
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
        json:true
    },function(error, response, body){


      //si ca trouve une question on relance direct la fonction pour voir si il y en a une autre, sinon le systeme se met en veille
      if(response.body.success)
      {

        var infosQuestion = response.body;


        //on check si il y a une reponse et on la renvoi
        for(var i =0; i<questions.length;i++) {
          if(infosQuestion.question.question.toLowerCase() == questions[i].question.toLowerCase()) {
            infosQuestion.question.answer = questions[i].answer;
          }
        }

        //envoie de la reponse

          request.post(
      		    'http://localhost:7000/api/home/addAnswer',
      		    { json: { infosQuestion } },
      		    function (error, response, body) {
      					console.log(response);
      		    }
      		);

        requestQuestion();
      }

    });

}



router.route('/')


	/*******************************
	Récupération de la question et envoie de la reponse
	********************************/
	.post(function(req, res){

    var questionUser = req.body.uneQuestion.question;
    var success = false;
    var answer = null;

    //on va checker dans le fichier json si la question existe bien et qu'il y a une réponse
    for(var i =0; i<questions.length;i++) {
      if(questionUser.toLowerCase() == questions[i].question.toLowerCase()) {
        answer = questions[i].answer;
        success = true;
      }
    }

    //si le systeme a trouvé une reponse
    if(success) {
      res.send({success:success, answer:answer});
    }else{
      res.send({success:success});
    }


	});




module.exports = router;
