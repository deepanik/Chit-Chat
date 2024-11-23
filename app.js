// Import and configure dotenv
import dotenv from 'dotenv';
dotenv.config();

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database
const database = firebase.database();

// Get a reference to the messages section
const messagesRef = database.ref('messages');

// Retrieve existing messages when the page loads
messagesRef.on('value', (snapshot) => {
  const messages = snapshot.val();
  let messageHTML = '';
  if (messages) {
    Object.keys(messages).forEach((key) => {
      messageHTML += `<p>${messages[key].text}</p>`;
    });
  }
  document.getElementById('messages').innerHTML = messageHTML;
});

// Listen for new messages
messagesRef.on('child_added', (snapshot) => {
  const message = snapshot.val();
  const messageHTML = `<p>${message.text}</p>`;
  document.getElementById('messages').innerHTML += messageHTML;
});

// Send message function
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value.trim();

  if (messageText) {
    // Save the message to the database
    messagesRef.push({
      text: messageText,
    });

    // Clear the input field
    messageInput.value = '';
  }
}

// Add event listener to the send button
document.getElementById('send-button').addEventListener('click', sendMessage);
