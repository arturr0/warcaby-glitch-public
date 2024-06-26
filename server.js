const app = require('./app.js'); // Import the Express app
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIo(server);
app.use('/public', express.static(path.join(__dirname, "public")));
// Namespace for /warcaby
const warcabyNamespace = io.of('/warcaby');

// Define the path to your JSON file
const jsonFilePath = path.join(__dirname, 'data', 'players.json');

const users = [];
let BOARD;
let PAWNS;
let TURN;
let CHECK;
let PLAY;
let KILL;
let KILLER_MODE;
let PLAYERS = [];

//io.sockets.emit('new state', BOARD, PAWNS, TURN, PLAY, CHECK, KILL);
//io.to(USERS[0][1]).emit('chat', MESS, USER)
warcabyNamespace.on('connection', (socket) => {
    console.log('We have a new client in /warcaby: ' + socket.id);

    // Track the server the client joined
    socket.on('joinServer', (data) => {
        console.log('Received data:', data);
        const ROOM = `room_${data.index}`;
        socket.serverIndex = data.index; // Store the server index in the socket object
        users.push([data.index, data.inputText, socket.id, data.player]);
        socket.join(ROOM);
        console.log(`Socket ${socket.id} joined room ${ROOM}`);
        warcabyNamespace.to(ROOM).emit('joinedRoom', ROOM);
    });
    socket.on('send2', (message, room) => {
        const MESS = message; 
        warcabyNamespace.to(room).emit('send to room', MESS);
    });
    socket.on('send1', (message, room) => {
        const MESS = message;

        socket.broadcast.to(room).emit('send to opponent', MESS);
    });
    socket.on('state', function(Board, Pawns, Greenturn, check, current, killConditions, room) {
        BOARD = Board;
        PAWNS = Pawns;
        // //console.log("check");
        if (!check) TURN = !Greenturn;
        else TURN = Greenturn;
        //TURN = !Greenturn;
        CHECK = check;
        PLAY = current;
        KILL = killConditions;
        //console.log("state " + TURN);
        socket.broadcast.to(room).emit('new state', BOARD, PAWNS, TURN, PLAY, CHECK, KILL);
      });
    
      socket.on('move', function(targetPos, room) {
        let newPos = { 
            x: targetPos.x, 
            y: targetPos.y, 
            oldX: targetPos.oldX, 
            oldY: targetPos.oldY, 
            looserIndex: targetPos.looserIndex // Include looserIndex
        };
        warcabyNamespace.to(room).emit('animate', newPos); // Broadcast to all clients
    });
    
      socket.on('killer mode', function(killersOptMode, Pawns, room) {
        KILLER_MODE = killersOptMode;
        PAWNS = Pawns;
        warcabyNamespace.to(room).emit('update killer mode', KILLER_MODE, PAWNS);  
      });
    
      socket.on('complete', function(Player, room) {
        PLAYERS.push([Player, room]);
        console.log(PLAYERS);
        for (let i = 0; i < PLAYERS.length; i++)
            for (let j = 0; j < PLAYERS.length; j++)
        if (i != j && ((PLAYERS[i][0] == 1 && PLAYERS[j][0] == 2) || (PLAYERS[i][0] == 2 && PLAYERS[j][0] == 1)) &&
            PLAYERS[i][1] == room && PLAYERS[j][1] == room) {
            warcabyNamespace.to(PLAYERS[j][1]).emit('both completed');
          
          PLAYERS.splice(i, 1);
          PLAYERS.splice(j, 1);
          
        }  
      });
      socket.on('message kill', function(message, played, pawnLetter, pawnNumber, pawnLetterLooser, pawnNumberLooser, room) {
        let MES = message;
        let PLAYED = played;
        
        let LETTER = pawnLetter;
        let NUMBER = pawnNumber;
        let LETTER_LOOSER = pawnLetterLooser;
        let NUMBER_LOOSER = pawnNumberLooser;
        warcabyNamespace.to(room).emit('update message kill', MES, PLAYED, LETTER, NUMBER, LETTER_LOOSER, NUMBER_LOOSER);  
      });
      socket.on('message move', function(message, played, pawnLetter, pawnNumber, boardLetter, boardNumber, room) {
        let MES = message;
        let PLAYED = played;
        
        let LETTER = pawnLetter;
        let NUMBER = pawnNumber;
        let LETTER_BOARD = boardLetter;
        let NUMBER_BOARD = boardNumber;
        warcabyNamespace.to(room).emit('update message move', MES, PLAYED, LETTER, NUMBER, LETTER_BOARD, NUMBER_BOARD);  
      });
      socket.on('send message', function(inputValString, room, Player) {
        let MESS = inputValString;
        let SENDER = Player;
        console.log("chat");
        socket.broadcast.to(room).emit('chat', MESS, SENDER);
        
      });
      

    // Handle client disconnection
    socket.on('disconnect', () => {
        if (socket.serverIndex !== undefined) {
            // Read the JSON file
            fs.readFile(jsonFilePath, 'utf8', (err, fileData) => {
                if (err) {
                    console.error('Error reading JSON file:', err);
                    return;
                }

                try {
                    // Parse the JSON data
                    let jsonData = JSON.parse(fileData);

                    // Decrement the player count if the server index is valid
                    if (jsonData[socket.serverIndex]) {
                        jsonData[socket.serverIndex].players = Math.max(0, jsonData[socket.serverIndex].players - 1);

                        // Clear user1 or user2 if it matches the disconnected user
                        for (let i = 0; i < users.length; i++) {
                            if (socket.id === users[i][2] && jsonData[users[i][0]].user1 === users[i][1]) {
                                jsonData[users[i][0]].user1 = '';
                            } else if (socket.id === users[i][2] && jsonData[users[i][0]].user2 === users[i][1]) {
                                jsonData[users[i][0]].user2 = '';
                            }
                        }

                        // Write the updated JSON back to the file
                        fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                            if (err) {
                                console.error('Error writing to JSON file:', err);
                            } else {
                                console.log('JSON file updated successfully after disconnection');
                            }
                        });
                    }
                } catch (err) {
                    console.error('Error parsing JSON data:', err);
                }
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
