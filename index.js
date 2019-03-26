var express = require('express');
var socket = require('socket.io');

//app setup

var app = express();
var server = app.listen(8095, function(){
    console.log("listening on port 8095")
});

//static files
app.use(express.static('public'));

//socket setup

var io = socket(server);

io.on('connection', function(socket){
    console.log("made socket connection", socket.id)

    socket.on('start', function(data){
        io.sockets.emit('start', data);
    });

    socket.on('changeTurn', function(data){
        io.sockets.emit('changeTurn', data);
    });

    socket.on('atakFunction', function(data){
        io.sockets.emit('atakFunction', data);
    });

    socket.on('moveFunction', function(data){
        io.sockets.emit('moveFunction', data);
    });

    socket.on('play', function(data){
        io.sockets.emit('play', data);
    });
    
});

//database section

const mysql = require('mysql');
const bodyparser = require('body-parser');
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host:'http://raranda.techlaunch.online:7000',
    user: 'root',
    password: '',
    database: "tank",
    multipleStatements: true
});

mysqlConnection.connect(function(err){
    if(err){
        console.log("you have an error " + err);
    }else{
        console.log("connected");
    };
});


app.get('/players', function(req, res){
    mysqlConnection.query('SELECT * FROM records', function(err, rows, fields){
        if(err){
            console.log('you have an error ' + err);
        }else{
            console.log(rows);
            res.send(rows); 
        };
    });
})

//nunca se ha llamado players/ id
app.get('/players/:id', function(req, res){
    mysqlConnection.query('SELECT * FROM records WHERE id = ?', [req.params.id], function(err, rows, fields){
        if(!err){
            console.log(rows);
            res.send(rows);
           
        }else{
            console.log('you have an error ' + err);
        };
    });
})

//nunca se ha llamado delete
app.delete('/delete/:id', function(req, res){
    mysqlConnection.query('DELETE * FROM records WHERE id = ?', [req.params.id], function(err, rows, fields){
        if(!err){
            console.log(rows);
            res.send("Deleted successfully");
           
        }else{
            console.log('you have an error ' + err);
        };
    });
})

app.post('/add', function(req, res){   
    let name = req.body.name;
    console.log(req);
    mysqlConnection.query(`INSERT INTO records (name) VALUES ('${name}')`,function(err, rows, fields){
        if(!err){
            console.log(rows);
            res.send(rows);
           
        }else{
            console.log('you have an error ' + err);
        };
    });
})

//nunca se ha llamado victories
app.get('/vitories', function(req, res){
    let victories = req.body.victories;
    mysqlConnection.query(`SELECT * FROM records WHERE victories = ${victories}`, [req.params.victories], function(err, rows, fields){
        if(!err){
            console.log(rows);
            res.send(rows);
           
        }else{
            console.log('you have an error ' + err);
        };
    });
})

app.post('/edit', function(req, res){
    let victories = req.body.victories;
    let defeat = req.body.defeat;
    let playerId = req.body.playerId;
    mysqlConnection.query(`UPDATE records SET victories='${victories}', defeat='${defeat}', games='${victories + defeat}' WHERE id = '${playerId}'`, function(err, rows, fields){
        if(!err){
            console.log(rows);
            res.send(rows);
           
        }else{
            console.log('you have an error ' + err);
        };
    });
})