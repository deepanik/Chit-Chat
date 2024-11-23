// Initialize Firebase
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAvcovuNoRZmVPs7Ms9bNbqqzDoSrRYO80",
//   authDomain: "chitchat-1199e.firebaseapp.com",
//   projectId: "chitchat-1199e",
//   storageBucket: "chitchat-1199e.firebasestorage.app",
//   messagingSenderId: "26054136546",
//   appId: "1:26054136546:web:e376c20f53ebe4dcc244bb",
//   measurementId: "G-JCV9XXHG2X"
// };

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
