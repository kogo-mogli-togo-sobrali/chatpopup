'use strict';

var chatSocket = null;
var clientId = 0;

function openChat() {
    document.getElementById('chat').style.display = 'block';
}

function closeChat() {
    document.getElementById('chat').style.display = 'none';
}

function sendMessage() {
    if (chatSocket === null || chatSocket.readyState != WebSocket.OPEN) {
        return;
    }

    var textArea = document.getElementById('chat-input-text');
    var text = textArea.value;
    var msg = {
        message: text,
        date: new Date().toISOString()
    };
    chatSocket.send(JSON.stringify(msg));
    textArea.value = '';
}

function connect() {
    var serverUrl;
    var scheme = 'ws';

    if (document.location.protocol === 'https://') {
        scheme += 's';
    }

    serverUrl = scheme + '://' + document.location.hostname + ':6502';

    chatSocket = new WebSocket(serverUrl, 'json');

    chatSocket.onopen = function (_evt) {
        openChat();
    }

    chatSocket.onmessage = function (evt) {
        var msg = JSON.parse(evt.data);
        console.log(msg);
    }
}
