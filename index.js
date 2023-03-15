var express = require('express');
var bodyParser = require('body-parser');

const MAIN_URL = "https://project-node-1c2r.onrender.com"
//const MAIN_URL = "http://localhost:3000";

function JSONtoXML(obj) {
    // source: https://codingbeautydev.com/blog/javascript-convert-json-to-xml/
    let xml = '';
    for (let prop in obj) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        for (let array in obj[prop]) {
          xml += '\n<' + prop + '>\n';
          xml += JSONtoXML(new Object(obj[prop][array]));
          xml += '</' + prop + '>';
        }
      } else if (typeof obj[prop] == 'object') {
        xml += JSONtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : '</' + prop + '>\n';
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;
};

function toHTML(arr){
    html = "<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'/><title>Response</title></head><body>";
    arr.map(function(annot){
        str = "<div id='" + annot.id 
            + "'><p class='annotUri'> annotUri : " + annot.annotUri 
            + "</p><p class ='id'> id : " + annot.id
            + "</p><p class ='URI'> URI : " + annot.URI
            + "</p><p class ='annoration'> annotation : " + annot.annotation
            + "</p><p class ='user_name'> user_name : " + annot.user_name
            + "</p></div>";
        html += str;
    });
    html += "</body></html>";
    return html;
};

var app = express();
var PORT =  process.env.PORT || 3000;
var n_annotations = 0;

var annotations = {format: 'json', data:[{
    annotUri: MAIN_URL + '/annotation/a',
    id: 'a',
    URI: 'jnjnjnjn',
    user_name: 'anonymous',
    annotation: 'jnjnjnbhjbbhbjuib'
  }, {
    annotUri: MAIN_URL + '/annotation/b',
    id: 'b',
    URI: 'jn.com',
    user_name: 'Hugo',
    annotation: 'hahaha'
  },
  {
    annotUri: MAIN_URL + '/annotation/c',
    id: 'c',
    URI: 'truc.com',
    user_name: 'Hugo',
    annotation: 'enorme'
  }

]};


// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/add_annotation', function(req, res) {
    console.log('receiving data ...');
    var annotation = req.body
    annotation['id'] = n_annotations.toString();
    annotation['annotUri'] = MAIN_URL + '/annotation/' + n_annotations.toString(),
    n_annotations += 1;
    annotations.data.push(annotation);
    res.status(200);
    res.send('Commentaire ajouté: ' + JSON.stringify(annotation));
    console.log('Commentaire ajouté: ' + JSON.stringify(annotation));
});

app.get("/get_all_annotations", function(req, res){
	var format=req.query.FormatAllAnnot;
    console.log(req.query.machin);
	if (format=="html"){
		req.headers['accept']= 'text/html';
	}
	else {
		if (format=="Json"){
			req.headers['accept']=  'application/json';
		}
        else{
            if (format == "xml"){
                req.headers['accept']= 'application/xml';
            }
        }	
	}
		
	res.format ({
		   'text/html': function() {
			  res.send(toHTML(annotations.data)); 
		   },
		   'application/json': function() {
			  res.send(annotations);
			},
            'application/xml': function() {
                xmlObj = JSONtoXML({'annotations':{'annotation': annotations.data} });
                res.send(xmlObj);
            }
	});
	
});

app.get("/annotation/:id", function(req, res){
	var id = req.params.id;
    var format = req.query.format;
	var filtered = annotations.data.filter(function (ann) {
        return( (ann.id === id)
        );
    });

    if (format=="html"){
		req.headers['accept']= 'text/html';
	}
	else {
		if (format=="Json"){
			req.headers['accept']=  'application/json';
		}
        else{
            if (format == "xml"){
                req.headers['accept']= 'application/xml';
            }
        }	
	}

    if (filtered.length == 0){
        res.status(404)
        res.send('Can\'t find annotation with id: ' + id)
        console.log('Can\'t find annotation ' + id)
    } else {
        res.format ({
            'text/html': function() {
               res.send(toHTML(filtered)); 
            },
            'application/json': function() {
               res.send({format:'json', data: filtered});
             },
             'application/xml': function() {
                 xmlObj = JSONtoXML({'annotations':{'annotation': filtered} });
                 res.send(xmlObj);
             }
        });
        console.log('annotation ' + id + ' sent to the format ' + format);
    }
	
});

app.get("/filtered_annotations", function(req, res){
	var format = req.query.format;
	var filter_id = req.query.reqId;
    var filter_uri = decodeURIComponent(req.query.reqUri);
    var filter_name = req.query.reqName;
    var n = parseInt(req.query.quantity);
    var pass_cond_id = (typeof(filter_id)=='undefined' || filter_id=="");
    var pass_cond_uri = (typeof(filter_uri)=='undefined' || filter_uri=="");
    var pass_cond_name = (typeof(filter_name)=='undefined' || filter_name=="");
    var pass_n_cond = (typeof(n)!='Number' || n<1);
	var filtered = annotations.data.filter(function (ann) {
        return( (pass_cond_name || ann.user_name === filter_name)
                && (pass_cond_id || ann.id === filter_id)
                && (pass_cond_uri || ann.URI === filter_uri )
        );
    });

    pass_n_cond ? filtered = filtered.slice(Math.max(filtered.length - n, 0)) : filtered=filtered;
    
    console.log(filtered)
    if (format=="html"){
		req.headers['accept']= 'text/html';
	}
	else {
		if (format=="Json"){
			req.headers['accept']=  'application/json';
		}
        else{
            if (format == "xml"){
                req.headers['accept']= 'application/xml';
            }
        }	
	}
	
	res.format ({
		   'text/html': function() {
			  res.send(toHTML(filtered)); 
		   },
		   'application/json': function() {
			  res.send({format:'json', data:filtered});
			},
            'application/xml': function() {
                xmlObj = JSONtoXML({'annotations':{'annotation': filtered} });
                res.send(xmlObj);
            }
	});
	
});

// start the server
app.listen(PORT);
console.log('Server started! At http://localhost:' + PORT);
