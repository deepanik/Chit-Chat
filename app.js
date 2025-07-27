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
const filesRef = database.ref('files');

// Function to scroll to bottom of messages
function scrollToBottom() {
  const messagesContainer = document.getElementById('messages-container');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to scroll to bottom of files list
function scrollFilesToBottom() {
  const filesListSection = document.getElementById('files-list-section');
  filesListSection.scrollTop = filesListSection.scrollHeight;
}

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
  // Scroll to bottom after loading messages
  setTimeout(scrollToBottom, 100);
});

// Listen for new messages
messagesRef.on('child_added', (snapshot) => {
  const message = snapshot.val();
  const messageHTML = `<p>${message.text || message.message}</p>`;
  document.getElementById('messages').innerHTML += messageHTML;
  // Scroll to bottom when new message is added
  setTimeout(scrollToBottom, 100);
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

// Add file function
function addFile(e) {
  e.preventDefault();
  const fileLinkInput = document.getElementById('file-link');
  const fileNameInput = document.getElementById('file-name');
  
  const fileLink = fileLinkInput.value.trim();
  const fileName = fileNameInput.value.trim();

  if (fileLink && fileName) {
    filesRef.push({
      link: fileLink,
      name: fileName,
      timestamp: Date.now()
    });
    
    // Clear inputs
    fileLinkInput.value = '';
    fileNameInput.value = '';
  } else {
    alert('Please enter both file link and file name!');
  }
}

// Function to shorten URL for display
function shortenUrl(url) {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname;
    let path = urlObj.pathname;
    
    // Remove www. if present
    if (domain.startsWith('www.')) {
      domain = domain.substring(4);
    }
    
    // Shorten path if too long
    if (path.length > 30) {
      path = path.substring(0, 30) + '...';
    }
    
    return `${domain}${path}`;
  } catch (error) {
    // If URL parsing fails, return a shortened version
    if (url.length > 40) {
      return url.substring(0, 40) + '...';
    }
    return url;
  }
}

// Display files function
function displayFiles(files) {
  const filesList = document.getElementById('files-list');
  let filesHTML = '';
  
  if (files) {
    Object.keys(files).forEach((key) => {
      const file = files[key];
      const shortUrl = shortenUrl(file.link);
      filesHTML += `
        <div class="file-item">
          <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-link" title="${file.link}">${shortUrl}</div>
          </div>
          <button class="download-button" onclick="downloadFile('${file.link}', '${file.name}')">
            Download
          </button>
        </div>
      `;
    });
  }
  
  filesList.innerHTML = filesHTML;
}

// Download file function
function downloadFile(link, fileName) {
  try {
    // Show loading state
    const downloadButton = event.target;
    const originalText = downloadButton.textContent;
    downloadButton.textContent = 'Downloading...';
    downloadButton.disabled = true;
    
    // Create a temporary anchor element to trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = link;
    downloadLink.download = fileName;
    downloadLink.style.display = 'none';
    
    // Append to body, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Reset button after a short delay
    setTimeout(() => {
      downloadButton.textContent = originalText;
      downloadButton.disabled = false;
    }, 2000);
    
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new tab if download fails
    window.open(link, '_blank');
  }
}

// Retrieve and display existing files
filesRef.on('value', (snapshot) => {
  const files = snapshot.val();
  displayFiles(files);
  // Scroll to bottom after loading files
  setTimeout(scrollFilesToBottom, 100);
});

// Listen for new files
filesRef.on('child_added', (snapshot) => {
  const files = snapshot.val();
  displayFiles(files);
  // Scroll to bottom when new file is added
  setTimeout(scrollFilesToBottom, 100);
});

// Event listeners
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('add-file-button').addEventListener('click', addFile);

// Clear chat function
document.getElementById('clear-button').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all messages?')) {
    messagesRef.remove();
  }
});
