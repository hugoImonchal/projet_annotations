var express = require('express');
var n_annotation = 0;
var app = express();

// interface Note {
//     numerateur: Number;
//     denominateur: Number;
// }

// interface Annotation {
//     annotation_URI: string;
//     target_URI: string;
//     uer_agent: string;
//     annotation: string;
//     note?: Note;
// };

var annotations = [];

const port = process.env.PORT || 3000;

app.get("/toto", function(req, res){
    res.send("Salut toto");
});

app.post("", function(req, res){
    console.log(req)
    res.send("bien reçu");
});

app.listen(port, function(){
    console.log('serveur listening on port: ' + port);
});

/*
- un post pour poster une annotation
- un get pour recolter une annotation
- un get pour recolter toutes les annotations,
- un get pour recolter toutes les annotations pour une ressource (URI) donné,
*/