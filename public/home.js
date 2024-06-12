$(document).ready(function() {
    function createServer() {
        $.post('/create-server')
            .done(function(data) {
                $('#servers').append(`
                    <div class="server_join" data-index="${data.index}" data-players="${data.players}">
                        <div class="server">SERVER ${data.index + 1}</div>
                        <button class="join">JOIN</button>
                    </div>
                `);
            })
            .fail(function(error) {
                console.error('Error:', error);
            });
    }

    $('#createServer').on('click', createServer);

    function update() {
        console.log("update");
        $.get('/servers-data')
            .done(function(jsonData) {
                $('#servers').empty();
                jsonData.forEach((server, index) => {
                    let joinButton = '';
                    if (server.players < 2) {
                        joinButton = '<button class="join">JOIN</button>';
                    }
                    const serverJoin = $(`
                        <div class="server_join" data-index="${index}" data-players="${server.players}" data-user1="${server.user1}" data-user2="${server.user2}">
                            <div class="server">SERVER ${index + 1}</div>
                            ${joinButton}
                        </div>
                    `);
                    $('#servers').append(serverJoin);
                    
                    // Attach click event handler to the join button
                    serverJoin.find('.join').click(function(event) {
                        event.preventDefault();
                        const inputText = $('#inputText').val(); // Retrieve input text
                        inputValString = String(inputText);  
                        // Check if input text is empty
                        if (inputText === null || inputText.trim() === '' ) {
                            alert('Please enter text before joining a server.');
                            return; // Prevent further action if input text is empty
                        }

                        const serverIndex = serverJoin.data('index');

                        // Fetch the latest data for this server
                        $.get('/servers-data')
                            .done(function(jsonData) {
                                const latestServerData = jsonData[serverIndex];

                                // Check if inputText is the same as user1 or user2
                                if (latestServerData.user1 === inputText || latestServerData.user2 === inputText ||
                                    latestServerData.user1 === inputText.trim() || latestServerData.user2 === inputText.trim()
                                ) {
                                    alert('You cannot use the same name as an existing player.');
                                    return; // Prevent further action if input text is the same as user1 or user2
                                }

                                let player;
                                console.log(player);
                                if (latestServerData.players < 2) {
                                    $.post('/submit', { inputText: inputText, index: serverIndex, players: latestServerData.players }) // Send input text, index, and players to server
                                        .done(function(data) {
                                            // Fetch updated server data after submission
                                            $.get('/servers-data')
                                                .done(function(updatedJsonData) {
                                                    const updatedServerData = updatedJsonData[serverIndex];
                                                    console.log(updatedServerData);
                                                    // Determine the player number based on updated server data
                                                    if (updatedServerData.user1 === inputText) {
                                                        player = 1;
                                                        console.log("player1");
                                                    } else if (updatedServerData.user2 === inputText) {
                                                        player = 2;
                                                        console.log("player2");
                                                    }
                                                    
                                                    // Store the necessary data in local storage
                                                    localStorage.setItem('serverData', JSON.stringify({
                                                        inputText: inputText,
                                                        index: serverIndex,
                                                        players: data.players,
                                                        player: player // Store the player information
                                                    }));

                                                    // Redirect to /warcaby
                                                    window.location.href = '/warcaby';
                                                })
                                                .fail(function(error) {
                                                    console.error('Error fetching updated server data:', error);
                                                });
                                        })
                                        .fail(function(error) {
                                            console.error('Error:', error);
                                        });
                                } else {
                                    // Player count is already 2, prevent further action
                                    console.log('Player count is already 2, cannot join.');
                                }
                            })
                            .fail(function(error) {
                                console.error('Error fetching latest server data:', error);
                            });
                    });
                });
            })
            .fail(function(error) {
                console.error('Error:', error);
            });
    }

    update();
    setInterval(update, 10000);
});
