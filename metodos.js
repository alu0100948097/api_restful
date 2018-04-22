"use strict";
var restify = require('restify');
var fs = require('fs');
var server = restify.createServer();
var Texto = "";

server.get('/asignaturas/all', (req,res,next) =>
{
    res.setHeader('Content-Type', 'application/json');
    var file = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    res.json(file);
	next();
});


server.get('/asignaturas/add/:valor', (req,res,next) =>
{
    var value = req.params.valor.toString();
    var file = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    for (var i = 0; i < file.length; i++)
           if (i==file.length-1)
                var n_nid = file[i].nid+1
    var tmp = { nid: n_nid, valor: value }
    file.push(tmp);
    fs.writeFile('data.json', JSON.stringify(file));
    res.send("El valor " +value+ " ha sido añadido!");
	next();
});

server.get('/asignaturas/update/:nid/:valor', (req,res,next) =>
{
    var id = req.params.nid;
    var value = req.params.valor.toString();
    var file = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    for (var i = 0; i < file.length; i++)
           if(file[i].nid==parseInt(id))
                file[i].valor=value
    fs.writeFile('data.json', JSON.stringify(file));
    res.send("El id " +id+ " ha sido modificado por el valor " +value+ "!");
    next();
});

server.get('/asignaturas/delete/:nid', (req,res,next) =>
{
    var id = req.params.nid;
    var file = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    var n_file = [];
    var j = 0;
    for (var i = 0; i < file.length; i++)
    {
           if(file[i].nid!=parseInt(id))
           {
                n_file.push(file[i]);
                n_file[j].nid=j+1;
                j+=1;
           }
    }
    fs.writeFile('data.json', JSON.stringify(n_file));
    res.send("El id " +id+ " ha sido eliminado!");
    next();
});

server.listen(8888, function()
{
	console.log('%s escuchando en el puerto %s', server.name, server.url);
});

server.on('uncaughtException', (req,res,route,err) =>
{
	err.body = 'He pillado una excepcion :-(';
	res.send(500,err);
});
