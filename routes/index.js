const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Define the path to your JSON file
const jsonFilePath = path.join(__dirname, '..', 'data', 'players.json');

router.get('/', (req, res) => {
    res.render('home', { title: 'My HTML Page' });
});

router.get('/servers-data', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Server error');
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData); // Send JSON data to client
        } catch (err) {
            console.error('Error parsing JSON data:', err);
            return res.status(500).send('Server error');
        }
    });
});

router.post('/create-server', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Server error');
        }

        try {
            const jsonData = JSON.parse(data);
            const newServerIndex = jsonData.length;
            const newServer = {
                players: 0,
                user1: "",
                user2: ""
            };
            jsonData.push(newServer);

            fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to JSON file:', err);
                    return res.status(500).send('Server error');
                }

                res.json({ // Send a JSON response
                    players: newServer.players,
                    index: newServerIndex
                });
            });
        } catch (err) {
            console.error('Error parsing JSON data:', err);
            return res.status(500).send('Server error');
        }
    });
});

router.post('/submit', (req, res) => {
    const { inputText, index } = req.body;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Server error');
        }

        try {
            const jsonData = JSON.parse(data);

            if (jsonData && jsonData.length > index) {
                const server = jsonData[index];
                server.players = (server.players || 0) + 1;

                if (!server.user1) {
                    server.user1 = inputText;
                } else if (!server.user2) {
                    server.user2 = inputText;
                }

                fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to JSON file:', err);
                        return res.status(500).send('Server error');
                    }

                    res.json({ // Send a JSON response
                        players: server.players,
                        index: index
                    });
                });
            } else {
                return res.status(500).send('No server data found');
            }
        } catch (err) {
            console.error('Error parsing JSON data:', err);
            return res.status(500).send('Server error');
        }
    });
});

module.exports = router;
