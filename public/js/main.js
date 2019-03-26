//make conection
var socket = io.connect('http://raranda.techlaunch.online:8095')

// variables globales
var field = "";
var father = "";
var son = "";
var movement = "";
var playerTurn = "rojo";
var atak = false;
var move = true;
var redTanks = [
    '<img src="img/infanteriaR.png">',
    '<img src="img/infanteriaR.png">',
    '<img src="img/tanqueR.png">',
    '<img src="img/artilleriaR.png">',
    '<img src="img/infanteriaR.png">',
    '<img src="img/infanteriaR.png">',
    '<img src="img/tanqueR.png">',
    '<img src="img/artilleriaR.png">',
    '<img src="img/artilleriaR.png">',
    '<img src="img/tanqueR.png">',
    '<img src="img/infanteriaR.png">',
    '<img src="img/infanteriaR.png">',
    '<img src="img/artilleriaR.png">',
    '<img src="img/tanqueR.png">',
    '<img src="img/infanteriaR.png">',
    '<img src="img/infanteriaR.png">'
];
var blueTanks = [
    '<img src="img/infanteriaA.png">',
    '<img src="img/infanteriaA.png">',
    '<img src="img/tanqueA.png">',
    '<img src="img/artilleriaA.png">',
    '<img src="img/infanteriaA.png">',
    '<img src="img/infanteriaA.png">',
    '<img src="img/tanqueA.png">',
    '<img src="img/artilleriaA.png">',
    '<img src="img/artilleriaA.png">',
    '<img src="img/tanqueA.png">',
    '<img src="img/infanteriaA.png">',
    '<img src="img/infanteriaA.png">',
    '<img src="img/artilleriaA.png">',
    '<img src="img/tanqueA.png">',
    '<img src="img/infanteriaA.png">',
    '<img src="img/infanteriaA.png">'
];




// tipos de fichas
var tank = {
    name: "Tank",
    range: 3,
    movility: 3
};
var infantery = {
    name: "Infantery",
    range: 2,
    movility: 4
};
var artillery = {
    name: "Artillery",
    range: 4,
    movility: 2
};


// recoger y desplegar los botones

function display1() {
    document.getElementById('button').classList.add('rotation');
}

function displayNone1() {
    document.getElementById('button').classList.remove('rotation');
}


function display2() {
    document.getElementById('atak').classList.add('rotation');
}

function displayNone2() {
    document.getElementById('atak').classList.remove('rotation');
}
// **************
function display3() {
    document.getElementById('move').classList.add('rotation');
}

function displayNone3() {
    document.getElementById('move').classList.remove('rotation');
}
//*************** */
function display4() {
    document.getElementById('show').classList.add('rotation');
}

function displayNone4() {
    document.getElementById('show').classList.remove('rotation');
}
//********************* */
function display5() {
    document.getElementById('ocultar').classList.add('rotation');
}

function displayNone5() {
    document.getElementById('ocultar').classList.remove('rotation');
}
// *********************************************
function display6() {
    document.getElementById('reload-button').classList.add('rotation');
}

function displayNone6() {
    document.getElementById('reload-button').classList.remove('rotation');
}



// creacion del terreno
function createField() {
    field = document.getElementById("field");

    for (e = 0; e < 16; e++) {
        var row = field.insertRow();
        for (c = 0; c < 16; c++) {
            // inclucion de las fichas dentro de las celdas
            var cell = row.insertCell();
            cell.setAttribute("onclick", "legend(this)");
            cell.setAttribute("id", e + '-' + c)
            // cell.addEventListener("click", function (this) {

            // });

            if (e == 0) cell.innerHTML = '<span class = rojo id = rojo>' + redTanks[c] + '</span>';
            else if (e == 15) cell.innerHTML = '<span class = azul id = azul>' + blueTanks[c] + '</span>';
        }
    }
}

//a partir de aqui///////////////////////////////////////
function legend(C) {
    //emitiendo el soket
    var celda = C.id;
    socket.emit('play', {
        celda: celda
    })

}
let paintedCells;
// limpiando todas las celdas coloreadas de verde
function cleaning() {
    for (var z = 0; z < 257; z++) {
        paintedCells[z].classList.remove("green");
        paintedCells[z].classList.remove("red");
        paintedCells[z].classList.remove("explosion");
    }
}

function play(T) {

    console.log("click en la celda = " + T.id);

    // console.log(document.getElementById(T.id));
    elements = document.querySelectorAll("table, table span ");
    paintedCells = document.querySelectorAll("table, table td");

    // condiciones de movimiento del tanque
    if (!movement && T.firstElementChild) {
        if (T.firstElementChild.id == playerTurn) {
            if (move == true) {
                if (!T.classList.contains("stay")) {
                    if (T.innerHTML[43] == "t") {
                        // console.log(T.innerHTML[43])
                        father = T;
                        son = T.innerHTML;
                        for (i = 0; elements[i]; i++) elements[i].classList.add("hand");
                        movement = true;

                        // pasando los atributos de id y alcance
                        var cells = getRange(T.id, tank.movility);
                        // console.log(cells);
                        for (var w = 0; w < cells.length; w++) {
                            document.getElementById(cells[w]).classList.add("green");
                        }
                    }

                }

            }
        }

    } else if (movement) {
        if (T.classList.value == "green" || T.classList.value == "capitalRed green" || T.classList.value == "capitalGreen green") {
            if (T.innerHTML[1] != "s") {

                father.innerHTML = "";
                T.innerHTML = son;

                document.getElementById(T.id).classList.add("stay")
                for (i = 0; elements[i]; i++) elements[i].classList.remove("hand");
                movement = false;
                T.classList.remove("capital");
                cleaning();
            }
        } 
    }
    // funcion para destruir un tanque enemigo
    if (!movement && T.firstElementChild) {
        if (T.firstElementChild.id == playerTurn) {
            if (atak == true) {
                if (!T.classList.contains("stay")) {
                    if (T.innerHTML[43] == "t") {
                        father = T;
                        son = T.innerHTML;
                        for (i = 0; elements[i]; i++) elements[i].classList.add("hand");
                        movement = true;

                        // pasando los atributos de id y alcance
                        var cells = getRange(T.id, tank.range);
                        // console.log("rango de ataque = " + cells);
                        for (var w = 0; w < cells.length; w++) {
                            document.getElementById(cells[w]).classList.add("red");
                        }
                        // marcando el lugar desde donde ataco
                        document.getElementById(T.id).classList.add("stay");
                    }

                }
            }
        }

    } else if (movement) {
        if (T.classList.value == "red" || T.classList.value == "capitalRed red" || T.classList.value == "capitalGreen red") {

            T.innerHTML = "";
            for (i = 0; elements[i]; i++) elements[i].classList.remove("hand");
            movement = false;
            cleaning();
            document.getElementById(T.id).classList.add("explosion");
        }
    }

    // condiciones de movimiento de la infanteria

    if (!movement && T.firstElementChild) {
        if (T.firstElementChild.id == playerTurn) {
            if (move == true) {
                if (!T.classList.contains("stay")) {
                    if (T.innerHTML[43] == "i") {
                        // console.log(T.innerHTML[43])
                        father = T;
                        son = T.innerHTML;
                        for (i = 0; elements[i]; i++) elements[i].classList.add("hand");
                        // console.log("se declara movimiento verdadero");
                        movement = true;

                        // pasando los atributos de id y alcance
                        var cells = getRange(T.id, infantery.movility);
                        // console.log(cells);
                        for (var w = 0; w < cells.length; w++) {
                            document.getElementById(cells[w]).classList.add("green");
                        }
                    }

                }

            }
        }

    } else if (movement) {
        if (T.classList.value == "green" || T.classList.value == "capitalRed green" || T.classList.value == "capitalGreen green" || T.classList.value == "capitalGreen stay green" || T.classList.value == "capitalRed stay green") {
            if (T.innerHTML[1] != "s") {
                father.innerHTML = "";
                T.innerHTML = son;
                document.getElementById(T.id).classList.add("stay")
                for (i = 0; elements[i]; i++) elements[i].classList.remove("hand");
                movement = false;
                cleaning()
            }
        }
    }
    // funcion para destruir una infanteria enemiga
    if (!movement && T.firstElementChild) {
        if (T.firstElementChild.id == playerTurn) {
            if (atak == true) {
                if (!T.classList.contains("stay")) {
                    if (T.innerHTML[43] == "i") {
                        father = T;
                        son = T.innerHTML;
                        for (i = 0; elements[i]; i++) elements[i].classList.add("hand");
                        movement = true;

                        // pasando los atributos de id y alcance
                        var cells = getRange(T.id, infantery.range);
                        // console.log("rango de ataque = " + cells);
                        for (var w = 0; w < cells.length; w++) {
                            document.getElementById(cells[w]).classList.add("red");
                        }
                        // marcando el lugar desde donde ataco
                        document.getElementById(T.id).classList.add("stay")
                    }

                }
            }
        }

    } else if (movement) {
        if (T.classList.value == "red" || T.classList.value == "capitalRed red" || T.classList.value == "capitalGreen red") {

            T.innerHTML = "";
            for (i = 0; elements[i]; i++) elements[i].classList.remove("hand");
            movement = false;
            cleaning()
            document.getElementById(T.id).classList.add("explosion");
        }
    }

    // condiciones de movimiento de la artilleria

    if (!movement && T.firstElementChild) {
        if (T.firstElementChild.id == playerTurn) {
            if (move == true) {
                if (!T.classList.contains("stay")) {
                    if (T.innerHTML[43] == "a") {
                        // console.log(T.innerHTML[43])
                        father = T;
                        son = T.innerHTML;
                        for (i = 0; elements[i]; i++) elements[i].classList.add("hand");
                        movement = true;

                        // pasando los atributos de id y alcance
                        var cells = getRange(T.id, artillery.movility);
                        // console.log(cells);
                        for (var w = 0; w < cells.length; w++) {
                            document.getElementById(cells[w]).classList.add("green");
                        }
                    }

                }

            }
        }
        // console.log("el contenido es " + T.classList)
    } else if (movement) {
        if (T.classList.value == "green" || T.classList.value == "capitalRed green" || T.classList.value == "capitalGreen green" || T.classList.value == "capitalGreen stay green" || T.classList.value == "capitalRed stay green") {
            if (T.innerHTML[1] != "s") {
                father.innerHTML = "";
                T.innerHTML = son;

                document.getElementById(T.id).classList.add("stay")
                for (i = 0; elements[i]; i++) elements[i].classList.remove("hand");
                movement = false;
                cleaning()
            }
        }
    }
    // funcion para destruir una artilleria enemiga
    if (!movement && T.firstElementChild) {
        if (T.firstElementChild.id == playerTurn) {
            if (atak == true) {
                if (!T.classList.contains("stay")) {
                    if (T.innerHTML[43] == "a") {
                        father = T;
                        son = T.innerHTML;
                        for (i = 0; elements[i]; i++) elements[i].classList.add("hand");
                        movement = true;

                        // pasando los atributos de id y alcance
                        var cells = getRange(T.id, artillery.range);
                        // console.log("rango de ataque = " + cells);
                        for (var w = 0; w < cells.length; w++) {
                            document.getElementById(cells[w]).classList.add("red");
                        }
                        // marcando el lugar desde donde ataco
                        document.getElementById(T.id).classList.add("stay")
                    }

                }
            }
        }

    } else if (movement) {
        if (T.classList.value == "red" || T.classList.value == "capitalRed red" || T.classList.value == "capitalGreen red") {

            T.innerHTML = "";
            for (i = 0; elements[i]; i++) elements[i].classList.remove("hand");
            movement = false;
            cleaning()
            document.getElementById(T.id).classList.add("explosion");
        }
    }

    // funcion para ganar
    //*************************************************************************** */


    function wining() {
        // var redCapital = document.getElementById('2-2');
        // var blueCapital = document.getElementById('13-13');

        if (document.getElementById('2-2').innerHTML == '<span class="azul" id="azul"><img src="img/tanqueA.png"></span>') {
            Alert.render('Blue Wins.');
            if (blueTeam == true && redTeam == false) {
                victories = victories + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            } else if (blueTeam == false && redTeam == true) {
                defeat = defeat + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            };

        } else if (document.getElementById('13-13').innerHTML == '<span class="rojo" id="rojo"><img src="img/tanqueR.png"></span>') {
            Alert.render('Red Wins.');
            if (blueTeam == false && redTeam == true) {
                victories = victories + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            } else if (blueTeam == true && redTeam == false) {
                defeat = defeat + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            };

        } else if (document.getElementById('13-13').innerHTML == '<span class="rojo" id="rojo"><img src="img/artilleriaR.png"></span>') {
            Alert.render('Red Wins.');
            if (blueTeam == false && redTeam == true) {
                victories = victories + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            } else if (blueTeam == true && redTeam == false) {
                defeat = defeat + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            };

        } else if (document.getElementById('2-2').innerHTML == '<span class="azul" id="azul"><img src="img/artilleriaA.png"></span>') {
            Alert.render('Blue Wins.');
            if (blueTeam == true && redTeam == false) {
                victories = victories + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            } else if (blueTeam == false && redTeam == true) {
                defeat = defeat + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            };

        } else if (document.getElementById('13-13').innerHTML == '<span class="rojo" id="rojo"><img src="img/infanteriaR.png"></span>') {
            Alert.render('Red Wins.');
            if (blueTeam == false && redTeam == true) {
                victories = victories + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            } else if (blueTeam == true && redTeam == false) {
                defeat = defeat + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            };

        } else if (document.getElementById('2-2').innerHTML == '<span class="azul" id="azul"><img src="img/infanteriaA.png"></span>') {
            Alert.render('Blue Wins.');
            if (blueTeam == true && redTeam == false) {
                victories = victories + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            } else if (blueTeam == false && redTeam == true) {
                defeat = defeat + 1;
                var url = '/edit';
                var data = {
                    playerId,
                    victories,
                    defeat
                };

                fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                    .then(response => console.log('Success:', JSON.stringify(response)))
                    .catch(error => console.error('Error:', error));
            };

        }
    }

    wining();
}

// receives a cord and returns you all cells within that range
function getRange(id, range) {
    // split id and get cords
    var cords = id.split('-');
    var x = cords[0] * 1;
    var y = cords[1] * 1;

    var area = [];
    // ***********************
    var chadow = document.querySelectorAll("td");
    for (var r = 0; r < chadow.length; r++) {
        var c = chadow[r].id;
        var cSplit = c.split('-');
        var x1 = cSplit[0] * 1;
        var y1 = cSplit[1] * 1;

        if (Math.abs(x1 - x) <= range && Math.abs(y1 - y) <= range) {
            area.push(c);
        }
    }



    return area;
}


// mejorando el cartel de ganador
function CustomAlert() {
    this.render = function (dialog) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        dialogbox.style.left = (winW / 2) - (550 * .5) + "px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Congratulations";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
    }
    this.ok = function () {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        // start();
    }
}
var Alert = new CustomAlert();


// *******************socket functions***********************************************************

function start() {
    document.getElementById('insertPlayer').classList.add('none-clase');
    document.getElementById('button').classList.add('buttonDisplay');
    document.getElementById('button').classList.remove('none-clase');
    document.getElementById('atak').classList.add('atakDisplay');
    document.getElementById('atak').classList.remove('none-clase');
    document.getElementById('move').classList.add('moveDisplay');
    document.getElementById('move').classList.remove('none-clase');
    document.getElementById('show').classList.remove('none-clase');
    document.getElementById('show').classList.add('showDisplay');

    document.getElementById('actionMenu').classList.add('actionMenu');
    document.getElementById('actionMenu').classList.remove('actionMenuX');
    document.getElementById('player-menu').classList.add('player-menu');
    document.getElementById('player-menu').classList.remove('player-menuX');
    document.getElementById('reload-button').classList.remove('none-clase');
    socket.emit('start', {

    })
};

socket.on('start', function (data) {
    document.getElementById("field").innerHTML = "";
    createField();
    document.getElementById('overStart').classList.add('startNone');
    document.getElementById('logo').classList.add('startNone');
    document.getElementById('2-2').classList.add("capitalRed");
    document.getElementById('13-13').classList.add("capitalGreen");
})

//********* */

function changeTurn() {
    socket.emit('changeTurn', {

    })
};

socket.on('changeTurn', function (data) {
    atak = false;
    move = true;

    if (playerTurn == "rojo") {
        playerTurn = "azul";
        teamCheck()
        document.getElementById('button').classList.remove('rojo');
        document.getElementById('button').classList.add('azul');
        document.getElementById('atak').classList.remove('rojo');
        document.getElementById('atak').classList.add('azul');
        document.getElementById('move').classList.remove('rojo');
        document.getElementById('move').classList.add('azul');
        document.getElementById('show').classList.remove('rojo');
        document.getElementById('show').classList.add('azul');
        document.getElementById('ocultar').classList.remove('rojo');
        document.getElementById('ocultar').classList.add('azul');
    } else {
        playerTurn = "rojo";
        teamCheck()
        document.getElementById('button').classList.remove('azul');
        document.getElementById('button').classList.add('rojo');
        document.getElementById('atak').classList.remove('azul');
        document.getElementById('atak').classList.add('rojo');
        document.getElementById('move').classList.remove('azul');
        document.getElementById('move').classList.add('rojo');
        document.getElementById('show').classList.remove('azul');
        document.getElementById('show').classList.add('rojo');
        document.getElementById('ocultar').classList.remove('azul');
        document.getElementById('ocultar').classList.add('rojo');
    }


    for (var p = 0; p < 256; p++) {
        paintedCells[p].classList.remove("stay");

    }
    document.getElementById('2-2').classList.add("capitalRed");
    document.getElementById('13-13').classList.add("capitalGreen");

})

//********* */

function atakFunction() {
    socket.emit('atakFunction', {

    })
};

socket.on('atakFunction', function (data) {
    atak = true;
    move = false;
    teamCheck()
    for (var z = 0; z < 257; z++) {
        paintedCells[z].classList.remove("explosion");
    }

})

//******** */

function moveFunction() {
    socket.emit('moveFunction', {})
};

socket.on('moveFunction', function (data) {
    atak = false;
    move = true;
    teamCheck()
    for (var z = 0; z < 257; z++) {
        paintedCells[z].classList.remove("explosion");
    }

})

//********** */

socket.on('play', function (data) {
    console.log(document.getElementById(data.celda))
    console.log(data.celda);
    play(document.getElementById(data.celda));
})



//database section
let name;
let playerId;
let victories = 1;
let defeat = 1;
let nameConfirmation = false;
let redTeam = false;
let blueTeam = false;

function VDcheck() {
    fetch('/players')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {

            for (var v = 0; v < myJson.length; v++) {
                if (name == myJson[v].name) {
                    victories = myJson[v].victories;
                    defeat = myJson[v].defeat;
                    playerId = myJson[v].id;
                };
            };
        });
};

function teamCheck() {
    document.getElementById('player_team_confirmation').classList.remove('none-clase');
    if (document.getElementById('checkRedTeam').checked == true) {
        redTeam = true;
        if(playerTurn == "rojo" && move == true){
            document.getElementById('player_team_confirmation').classList.add('colorRojo');
            document.getElementById('player_team_confirmation').classList.remove('colorAzul');
            document.getElementById('player_team_confirmation').innerHTML = "Your Team is moving";
        }else if(playerTurn == "rojo" && atak == true){
            document.getElementById('player_team_confirmation').classList.add('colorRojo');
            document.getElementById('player_team_confirmation').classList.remove('colorAzul');
            document.getElementById('player_team_confirmation').innerHTML = "Your Team is atacking";
        }else if(playerTurn == "azul" && move == true){
            document.getElementById('player_team_confirmation').classList.add('colorAzul');
            document.getElementById('player_team_confirmation').classList.remove('colorRojo');
            document.getElementById('player_team_confirmation').innerHTML = "Enemy Team is moving";
        }else if(playerTurn == "azul" && atak == true){
            document.getElementById('player_team_confirmation').classList.add('colorAzul');
            document.getElementById('player_team_confirmation').classList.remove('colorRojo');
            document.getElementById('player_team_confirmation').innerHTML = "Enemy Team is atacking";
        };
    } else if (document.getElementById('checkBlueTeam').checked == true) {
        blueTeam = true;
        document.getElementById('player_team_confirmation').classList.remove('none-clase');
        if(playerTurn == "rojo" && move == true){
            document.getElementById('player_team_confirmation').classList.add('colorRojo');
            document.getElementById('player_team_confirmation').classList.remove('colorAzul');
            document.getElementById('player_team_confirmation').innerHTML = "Enemy Team is moving";
        }else if(playerTurn == "rojo" && atak == true){
            document.getElementById('player_team_confirmation').classList.add('colorRojo');
            document.getElementById('player_team_confirmation').classList.remove('colorAzul');
            document.getElementById('player_team_confirmation').innerHTML = "Enemy Team is atacking";
        }else if(playerTurn == "azul" && move == true){
            document.getElementById('player_team_confirmation').classList.add('colorAzul');
            document.getElementById('player_team_confirmation').classList.remove('colorRojo');
            document.getElementById('player_team_confirmation').innerHTML = "Your Team is moving";
        }else if(playerTurn == "azul" && atak == true){
            document.getElementById('player_team_confirmation').classList.add('colorAzul');
            document.getElementById('player_team_confirmation').classList.remove('colorRojo');
            document.getElementById('player_team_confirmation').innerHTML = "Your Team is atacking";
        };

    
    };
};


function customConfirm() {
    this.render = function (dialog, op) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        dialogbox.style.left = (winW / 2) - (550 * .5) + "px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Congratulations";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Confirm.yes(\'' + op + '\')">Yes</button> <button onclick="Confirm.no()">No</button>';
    }
    this.no = function () {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        Alert.render("This name is already in use, you must use another name.");

    }
    this.yes = function (op) {
        if (op == "confirmar") {
            start();
        };
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
}
var Confirm = new customConfirm();


function insert() {
    name = document.getElementById('name').value;
    teamCheck();
    VDcheck();
    if (name != "" && redTeam == true || blueTeam == true) {
        fetch('/players')
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {

                for (var g = 0; g < myJson.length; g++) {
                    if (name == myJson[g].name) {
                        Confirm.render("The name is already in use. Are you " + name + " ?", 'confirmar')

                    } else {
                        nameConfirmation = true;
                    }

                };

            });



        if (nameConfirmation == true) {
            start();
            var url = '/add';
            var data = {
                name
            };

            fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .then(response => console.log('Success:', JSON.stringify(response)))
                .catch(error => console.error('Error:', error));
        }



    } else {
        Alert.render('You can not leave the name or the team in blank');
    };
};


function show() {
    document.getElementById('scoreTable').classList.remove('none-clase');
    document.getElementById('scoreTable').classList.add('mostrarTabla');
    document.getElementById('field').classList.add('none-clase');
    document.getElementById('show').classList.add('none-clase');
    document.getElementById('ocultar').classList.add('showDisplay');
    document.getElementById('ocultar').classList.remove('none-clase');


    fetch('/players')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {

            var top = [];
            var top10;
            for (var i = 0; i < myJson.length; i++) {
                top.push(myJson[i].victories)
            }

            function reverse(a) {
                a.sort(function (a, b) {
                    return b - a;
                });
                top10 = a;
            }
            reverse(top);

            recordTable(top10, myJson)
        });


    function recordTable(t, J) {
        console.log(t + " y " + J)
        var playerName = [];
        for (var e = 0; e < J.length; e++) {
            for (var b = 0; b < J.length; b++) {
                if (J[b].victories == t[e]) {
                    playerName.push(J[b].name)
                }
            }
        }


        document.getElementById("0").innerHTML = "Name: " + playerName[0] + " Victories: " + t[0];
        document.getElementById("1").innerHTML = "Name: " + playerName[1] + " Victories: " + t[1];
        document.getElementById("2").innerHTML = "Name: " + playerName[2] + " Victories: " + t[2];
        document.getElementById("3").innerHTML = "Name: " + playerName[3] + " Victories: " + t[3];
        document.getElementById("4").innerHTML = "Name: " + playerName[4] + " Victories: " + t[4];
        document.getElementById("5").innerHTML = "Name: " + playerName[5] + " Victories: " + t[5];
        document.getElementById("6").innerHTML = "Name: " + playerName[6] + " Victories: " + t[6];
        document.getElementById("7").innerHTML = "Name: " + playerName[7] + " Victories: " + t[7];
        document.getElementById("8").innerHTML = "Name: " + playerName[8] + " Victories: " + t[8];
        document.getElementById("9").innerHTML = "Name: " + playerName[9] + " Victories: " + t[9];
    }
};

function ocultar() {
    document.getElementById('scoreTable').classList.add('none-clase');
    document.getElementById('scoreTable').classList.remove('mostrarTabla');
    document.getElementById('field').classList.remove('none-clase');
    document.getElementById('show').classList.remove('none-clase');
    document.getElementById('ocultar').classList.add('none-clase');
}


function checkRed() {
    if (document.getElementById('checkRedTeam').checked == true) {
        document.getElementById('checkBlueTeam').checked = false
        document.getElementById('start').classList.remove('colorAzul');
        document.getElementById('start').classList.add('colorRojo');

    }
}

function checkBlue() {
    if (document.getElementById('checkBlueTeam').checked == true) {
        document.getElementById('checkRedTeam').checked = false
        document.getElementById('start').classList.remove('colorRojo');
        document.getElementById('start').classList.add('colorAzul');
    }
}