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
        console.warn('socket closed');
        return;
    }

    var text = document.getElementById('text').innerText.trim();
    document.getElementById('text').innerText = '';
    document.getElementById('placeholder').style.display = 'block';
    if (text.length > 0) {
        var msg = {
            message: text,
            date: new Date().toISOString()
        };
        chatSocket.send(JSON.stringify(msg));
        addUserMessage(text);
    }
}

function connect() {
    var serverUrl = 'ws://localhost:27015/send';

    chatSocket = new WebSocket(serverUrl, 'json');

    chatSocket.onopen = function (_evt) {
        openChat();
    }

    chatSocket.onmessage = function (evt) {
        var msg = JSON.parse(evt.data);
        console.log(msg);
        addBotMessage(msg.message);
        if (msg.options != null) {
            for (var i = 0; i < msg.options.length; ++i) {
                addOption(msg.options[i]);
            }
        }
    }
}

function focusInput() {
    document.getElementById('text').focus();
    document.getElementById('placeholder').style.display = 'none';
}

function blurInput() {
    if (document.getElementById('text').innerText.trim().length === 0) {
        document.getElementById('placeholder').style.display = 'block';
    }
}

function addUserMessage(text) {
    var msgBuble = document.createElement('div');
    msgBuble.className = 'user-message';
    msgBuble.innerText = text;

    var container = document.getElementById('messagebox');
    container.appendChild(msgBuble);
}

function addBotMessage(text) {
    var msgBuble = document.createElement('div');
    msgBuble.className = 'bot-message';
    msgBuble.innerText = text;

    var container = document.getElementById('messagebox');
    container.appendChild(msgBuble);
}

function addOption(text) {
    var optBuble = document.createElement('div');
    optBuble.className = 'opt-message';
    optBuble.innerText = text;
    optBuble.onclick = function () {
        document.getElementById('text').innerText = text;
        var mb = document.getElementById('messagebox');
        var opts = document.getElementsByClassName('opt-message');
        while (opts.length > 0) {
            mb.removeChild(opts[0]);
        }
        sendMessage();
    };

    var box = document.getElementById('messagebox');
    box.appendChild(optBuble);
}

connect();
