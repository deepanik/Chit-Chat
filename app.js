// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBanhM2l7eFP5h3COf4do9SIhc69qlpr90",
    authDomain: "chitchat-74279.firebaseapp.com",
    databaseURL: "https://chitchat-74279-default-rtdb.firebaseio.com/",
    projectId: "chitchat-74279",
    storageBucket: "chitchat-74279.appspot.com",
    messagingSenderId: "715250278110",
    appId: "1:715250278110:web:34d555b57405e7b3006c4f"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the database
var database = firebase.database();

// Get a reference to the messages section
var messagesRef = database.ref('messages');

// Retrieve existing messages when the page loads
messagesRef.on('value', function(data) {
    var messages = data.val();
    var messageHTML = '';
    Object.keys(messages).forEach(function(key) {
        messageHTML += '<p>' + messages[key].text + '</p>';
    });
    document.getElementById('messages').innerHTML = messageHTML;
});

// Listen for new messages
messagesRef.on('child_added', function(data) {
    var message = data.val();
    var messageHTML = '<p>' + message.text + '</p>';
    document.getElementById('messages').innerHTML += messageHTML;
});

// Send message function
function sendMessage() {
    var messageInput = document.getElementById('message-input');
    var messageText = messageInput.value;

    // Save the message to the database
    messagesRef.push({
        text: messageText
    });

    // Clear the input field
    messageInput.value = '';
}

// Add event listener to the send button
document.getElementById('send-button').addEventListener('click', sendMessage);