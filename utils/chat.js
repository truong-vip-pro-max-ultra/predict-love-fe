'use strict';

function getJwtTokenFromLocalStorage(){
    var jwtToken = localStorage.getItem("jwtToken");
    return jwtToken != null ? jwtToken : null;
}
function getUserInfo(){
    var jwtToken = getJwtTokenFromLocalStorage();
    if(jwtToken!=null){
        return $.ajax({
            url : server+"/user",
            headers: {
             'Authorization':'Bearer '+jwtToken
             },
            type : "POST",
            dataType:"json",
        });
    }
    return null;
}



var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];


function connect(user) {
    if(user) {
        username = user;
        // usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS(server+'/predict-love-chat');
        stompClient = Stomp.over(socket);
        stompClient.debug = null;
        
        stompClient.connect({}, onConnected, onError);
    }
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.register",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Không thể kết nối đến Server. Vui lòng thử lại sau!';
    connectingElement.style.color = 'red';
}


function send(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}
function sendImg(imgBase64) {
    if(imgBase64 && stompClient) {
        var chatMessage = {
            sender: username,
            content: imgBase64,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
    }
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');
    var div = document.createElement('div');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' đã tham gia!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' đã rời!';
    } else {
        messageElement.classList.add('chat-message');
        
        
        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);
        div.appendChild(avatarElement);


        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);

        if(username == message.sender){
            div.id = "myChat";
            usernameElement.style.marginRight = "30px";
        }
        else{
            avatarElement.style.left="10px";
            usernameElement.style.display='flex';
            usernameElement.style.justifyContent='flex-start';
        }

        usernameElement.appendChild(usernameText);
        div.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var imgElement = document.createElement('img');
    if(username == message.sender){
        textElement.style.backgroundColor = "#FF3399";
        textElement.style.marginRight="30px";
    }
    else{
        textElement.style.paddingLeft="10px";
    }
    var messageText = document.createTextNode(message.content);
    if(message.content.startsWith('CHAT-IMG|')){
        var content = message.content;
        content = content.substring('CHAT-IMG|'.length);
        imgElement.src = content;
        imgElement.width="200";
        imgElement.style.marginRight="30px";
        imgElement.style.borderRadius="20px";
        div.appendChild(imgElement);
        messageElement.appendChild(div);
        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
    }
    else{
        if(message.content.length<8000){
            textElement.appendChild(messageText);
            textElement.style.color="white";
            if(message.type==='JOIN' || message.type==='LEAVE'){
                textElement.style.borderRadius = "10px";
                textElement.style.marginRight="-20px";
                if(username != message.sender){
                    textElement.style.backgroundColor="black";
                    if(message.type==='LEAVE')
                        textElement.style.backgroundColor="red";
                }
            }
            div.appendChild(textElement);
            messageElement.appendChild(div);
            messageArea.appendChild(messageElement);
            messageArea.scrollTop = messageArea.scrollHeight;
        }
        else{
            alertError("Nội dung tin nhắn tối đa 8000 ký tự!");
        }
        
    }
    
    
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

async function callChatWS() {
    try {
         const res = await getUserInfo();
         if(res !=null){
            if (res['username']!=undefined){
                connect(res['username']);
                messageForm.addEventListener('submit', send, true)
            }
              else{
                window.location.href = '../index.html';
              }
         } 
         else{
            window.location.href = '../index.html';
         }
       } catch(err) {
            console.log(err)
            localStorage.clear();
            window.location.href = '../index.html';
       }
}

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    if(file.type == 'image/gif' || file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg'){
        if(file.size <= 2048000){
            var reader = new FileReader();
            reader.onloadend = function() {
                sendImg('CHAT-IMG|'+reader.result);
            }
            reader.readAsDataURL(file);
            alertSuccess("Đang tải lên...");
        }
        else{
            alertError("Dung lượng ảnh tối đa 2MB!");
        }
        
    }
    else{
        alertError("Chỉ hỗ trợ định dạng ảnh!");
    }
}

callChatWS();

document.getElementById('btn-send-img').onclick = function(){
    document.getElementById('btn-upload-img').click();
}
document.getElementById('btn-upload-img').onchange=function(){
    encodeImageFileAsURL(this);
    document.getElementById('btn-upload-img').value=null;
}

window.addEventListener('beforeunload', (e) => {
    var chatMessage = {
        sender: username,
        type: 'LEAVE'
    };
    stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
});