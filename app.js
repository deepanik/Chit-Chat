// Initialize Firebase (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBanhM2l7eFP5h3COf4do9SIhc69qlpr90",
  authDomain: "chitchat-74279.firebaseapp.com",
  databaseURL: "https://chitchat-74279-default-rtdb.firebaseio.com",
  projectId: "chitchat-74279",
  storageBucket: "chitchat-74279.firebasestorage.app",
  messagingSenderId: "715250278110",
  appId: "1:715250278110:web:34d555b57405e7b3006c4f"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const messagesRef = database.ref('messages');

// Retrieve existing messages when the page loads
messagesRef.on('value', (snapshot) => {
  const messages = snapshot.val();
  let messageHTML = '';
  if (messages) {
    Object.keys(messages).forEach((key) => {
      messageHTML += `<p>${messages[key].text || messages[key].message}</p>`;
    });
  }
  document.getElementById('messages').innerHTML = messageHTML;
});

// Listen for new messages
messagesRef.on('child_added', (snapshot) => {
  const message = snapshot.val();
  const messageHTML = `<p>${message.text || message.message}</p>`;
  document.getElementById('messages').innerHTML += messageHTML;
});

// Send message function
function sendMessage(e) {
  e.preventDefault();
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value.trim();

  if (messageText) {
    messagesRef.push({
      text: messageText,
      timestamp: Date.now()
    });
    messageInput.value = '';
  }
}

document.getElementById('send-button').addEventListener('click', sendMessage);
