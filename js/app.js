'use strict';

let timerIdArray = [];

const printMessage = (printedMessage, direction) => $('#view-block').append(`<p class="text-${direction}">${printedMessage}</p>`);

const clearInputArea = () => $('#input-block textarea').val('');

const clearErrors = () => $('#error').html('');

const timeout = (message, time = 0) => {
    return new Promise(done => {
        let timerId = setTimeout(() => done(message), time * 1000);
        timerIdArray.push(timerId);
    });
};

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getBrowserAnswer = async () => {
    return $.ajax({
        // url: 'https://got-quotes.herokuapp.com/quotes?char=tyrion'
        url: 'data.json'
    })
        .done(data => data)
        .fail(function (errorMessage) {
            $('#main-block').html(errorMessage.responseText);
        });
};

let randomMessage = async () => {
    // const message = (await getBrowserAnswer()).quote;
    const messagesArray = await getBrowserAnswer();
    const message = messagesArray[rand(0, messagesArray.length - 1)];

    return timeout(message, rand(0, 3));
};

let printBrowserAnswer = async () => {
    const printedMessage = await randomMessage();
    printMessage(printedMessage, 'left');
};

const getUserMessage = async () => {
    let printedMessage = $('#input-block textarea').val();

    if (printedMessage){
        printMessage(printedMessage, 'right');
        if (printedMessage === 'My watch has ended') {
            closeChat();
        } else {
            clearErrors();
            clearInputArea();
            await printBrowserAnswer();
        }
    } else {
        $('#error').html('<div class="alert alert-danger" role="alert">Please, enter your message</div>');
    }
};

const startChat = async () => {
    printMessage('Hello', 'left');
};

const finishChat = async () => {
    let timerId = setTimeout(function () {
        printMessage('Sorry, but I need to finish this chat', 'left');
        closeChat();
    }, rand(5000, 100000));
    timerIdArray.push(timerId);
};

const closeChat = () => {
    printMessage('Bye, bye. It was a pleasure to chat with so interesting person', 'left');
    $('#send-message').remove();
    $('#input-block').remove();
    clearErrors();
    clearTimers();
};

let clearTimers = () => timerIdArray.forEach(element => clearTimeout(element));

$('#send-message').on('click', getUserMessage);

$(document).ready(startChat().then(finishChat));