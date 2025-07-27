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

// Function to scroll to bottom of messages
function scrollToBottom() {
  const messagesContainer = document.getElementById('messages-container');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to detect if a message contains a download link
function isDownloadLink(text) {
  const urlPattern = /https?:\/\/[^\s]+/g;
  
  // Exclude specific domain
  const excludedDomain = /exam\.testpad\.chitkarauniversity\.edu\.in/;
  
  // Download patterns for any domain
  const downloadPatterns = [
    // File extensions
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|mp3|mp4|avi|mov|jpg|jpeg|png|gif|txt|csv|iso|exe|msi|deb|rpm|apk|ipa|dmg|pkg)$/i,
    
    // Common download keywords in URL
    /download|file|attachment|get|fetch|retrieve/i,
    
    // Cloud storage patterns
    /drive\.google\.com\/uc\?export=download/,
    /dropbox\.com\/s\//,
    /mega\.nz\//,
    /mediafire\.com\//,
    /wetransfer\.com\//,
    /pcloud\.com\//,
    /box\.com\//,
    /onedrive\.live\.com\//,
    /sharepoint\.com\//,
    /amazonaws\.com\//,
    /github\.com\/.*\/releases/,
    
    // Shortened URL services (common ones)
    /bit\.ly|tinyurl\.com|goo\.gl|t\.co|is\.gd|v\.gd|ow\.ly|su\.pr|twurl\.nl|snipurl\.com|short\.to|BudURL\.com|ping\.fm|tr\.im|zip\.my|metamark\.net|sn\.im|shorturl\.at|rb\.gy|short\.io|cutt\.ly|adf\.ly|sh\.st|tiny\.cc|short\.ly|shorturl\.com|shorten\.as|shorturl\.co|shorturl\.me|shorturl\.net|shorturl\.org|shorturl\.to|shorturl\.tv|shorturl\.us|shorturl\.ws|shorturl\.xyz/i
  ];
  
  const urls = text.match(urlPattern);
  if (!urls) return false;
  
  return urls.some(url => {
    // Skip excluded domain
    if (excludedDomain.test(url)) return false;
    
    // Check if it matches any download pattern
    return downloadPatterns.some(pattern => pattern.test(url));
  });
}

// Function to extract filename from URL
function extractFilename(url) {
  try {
    const urlObj = new URL(url);
    let filename = urlObj.pathname.split('/').pop();
    
    // If no filename in path, try to get from query params
    if (!filename || filename === '') {
      const params = new URLSearchParams(urlObj.search);
      filename = params.get('id') || params.get('file') || 'download';
    }
    
    // Clean up filename
    filename = filename.replace(/[?#].*$/, ''); // Remove query and fragment
    if (!filename.includes('.')) {
      filename += '.file';
    }
    
    return filename || 'download';
  } catch (error) {
    return 'download';
  }
}

// Function to expand shortened URLs
async function expandShortUrl(shortUrl) {
  try {
    const response = await fetch(shortUrl, { 
      method: 'HEAD',
      redirect: 'follow'
    });
    return response.url;
  } catch (error) {
    console.log('Could not expand URL:', error);
    return shortUrl; // Return original if expansion fails
  }
}

// Function to create message HTML with download link detection
function createMessageHTML(messageText) {
  if (isDownloadLink(messageText)) {
    const urlMatch = messageText.match(/https?:\/\/[^\s]+/g);
    if (urlMatch) {
      const url = urlMatch[0];
      const filename = extractFilename(url);
      
      return `
        <div class="message">
          <div>${messageText.replace(url, '')}</div>
          <button class="download-link" onclick="downloadFile('${url}', '${filename}')">
            📥 Download ${filename}
          </button>
        </div>
      `;
    }
  }
  
  return `<p>${messageText}</p>`;
}

// Retrieve existing messages when the page loads
messagesRef.on('value', (snapshot) => {
  const messages = snapshot.val();
  let messageHTML = '';
  if (messages) {
    Object.keys(messages).forEach((key) => {
      const message = messages[key];
      const text = message.text || message.message;
      messageHTML += createMessageHTML(text);
    });
  }
  document.getElementById('messages').innerHTML = messageHTML;
  // Scroll to bottom after loading messages
  setTimeout(scrollToBottom, 100);
});

// Listen for new messages
messagesRef.on('child_added', (snapshot) => {
  const message = snapshot.val();
  const text = message.text || message.message;
  const messageHTML = createMessageHTML(text);
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

// Download file function
async function downloadFile(link, fileName) {
  try {
    // Show loading state
    const downloadButton = event.target;
    const originalText = downloadButton.textContent;
    downloadButton.textContent = '⏳ Downloading...';
    downloadButton.disabled = true;
    
    // Expand shortened URL if needed
    let finalUrl = link;
    if (isShortenedUrl(link)) {
      downloadButton.textContent = '⏳ Expanding URL...';
      finalUrl = await expandShortUrl(link);
    }
    
    // Create a temporary anchor element to trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = finalUrl;
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

// Function to check if URL is shortened
function isShortenedUrl(url) {
  const shortenedPatterns = [
    /bit\.ly|tinyurl\.com|goo\.gl|t\.co|is\.gd|v\.gd|ow\.ly|su\.pr|twurl\.nl|snipurl\.com|short\.to|BudURL\.com|ping\.fm|tr\.im|zip\.my|metamark\.net|sn\.im|shorturl\.at|rb\.gy|short\.io|cutt\.ly|adf\.ly|sh\.st|tiny\.cc|short\.ly|shorturl\.com|shorten\.as|shorturl\.co|shorturl\.me|shorturl\.net|shorturl\.org|shorturl\.to|shorturl\.tv|shorturl\.us|shorturl\.ws|shorturl\.xyz/i
  ];
  
  return shortenedPatterns.some(pattern => pattern.test(url));
}

// Event listeners
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage(e);
  }
});

// Clear chat function
document.getElementById('clear-button').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all messages?')) {
    messagesRef.remove();
  }
});
