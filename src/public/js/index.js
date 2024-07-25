const socket = io();
let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title: 'Enter your name',
    input: 'text',
    inputAttributes: {
        autocapitalize: 'off'
    },
    inputValidator: (value) => {
        if (!value) {
            return 'You need to write something!'
        }
    },
    allowOutsideClick: false,
    showCancelButton: false,
    confirmButtonText: 'Join'
}).then((result) => {
    if (result.isConfirmed) {
        user = result.value;
        socket.emit('newUser', user);
    }
});


chatBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if(chatBox.value.trim() !== ''){
            socket.emit('message', {user: user, message: chatBox.value});
            chatBox.value = '';
        }
    }
});

socket.on('messageLogs', (data) => {
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach((message) => {
        messages += `${message.user}: ${message.message} <br>`;
    });
    log.innerHTML = messages;
});

socket.on('newUser', (data) => {
    Swal.fire({
        text: data.message, 
        toast: true,
        position: 'top-right',
    });
});
