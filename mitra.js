document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatOptions = document.getElementById('chat-options');

    const BACKEND_URL = 'http://127.0.0.1:5500';

    // A list of critical keywords for an immediate, client-side safety check.
    const crisisKeywords = ['suicide', 'kill myself', 'want to die', 'hopeless', 'end my life', 'self-harm'];

    // --- Core Chatbot Functions ---

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.innerHTML = message; // Using innerHTML to render line breaks if any
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the bottom
    }

    function displayOptions(options) {
        chatOptions.innerHTML = '';
        if (options && options.length > 0) {
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('chat-option-btn');
                button.textContent = option;
                button.onclick = () => {
                    handleUserInput(option);
                    chatOptions.innerHTML = ''; // Clear options after one is clicked
                };
                chatOptions.appendChild(button);
            });
        }
    }

    async function getAIResponse(input) {
        // **CRITICAL: Safety check first on the client-side for immediate response**
        const lowerInput = input.toLowerCase();
        if (crisisKeywords.some(keyword => lowerInput.includes(keyword))) {
            return {
                reply: "It sounds like you are in serious distress. Please reach out for immediate help. It's important to talk to someone who can support you right now.<br>• <b>Kiran Mental Health Helpline:</b> 1800-599-0019<br>• <b>Vandrevala Foundation:</b> 9999666555<br>Please call one of these numbers. They are available 24/7."
            };
        }

        // Call the new backend API
        try {
            const response = await fetch(`${BACKEND_URL}/api/mitra_chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from the server.');
            }

            return await response.json(); // Returns an object like { "reply": "..." }
        } catch (error) {
            console.error('Error fetching AI response:', error);
            return { reply: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." };
        }
    }

    async function handleUserInput(inputText = null) {
        const text = inputText || userInput.value.trim();
        if (text === '') return;

        addMessage('user', text);
        userInput.value = '';
        chatOptions.innerHTML = ''; // Clear suggestion buttons
        userInput.disabled = true; // Disable input while AI is "thinking"
        sendBtn.disabled = true;

        // Add a typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message', 'bot-message');
        typingIndicator.innerHTML = '<i>Mitra is typing...</i>';
        chatWindow.appendChild(typingIndicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        const botResponse = await getAIResponse(text);

        // Remove the typing indicator
        chatWindow.removeChild(typingIndicator);

        addMessage('bot', botResponse.reply);

        userInput.disabled = false; // Re-enable input
        sendBtn.disabled = false;
        userInput.focus();
    }

    // --- Event Listeners and Initialization ---

    sendBtn.addEventListener('click', () => handleUserInput());
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleUserInput();
        }
    });

    function initializeChat() {
        addMessage('bot', "Hello! I'm Mitra, your AI assistant. I'm here to offer first-aid support. How are you feeling today?");
        displayOptions(['Feeling Anxious', 'Feeling Stressed', 'Feeling Sad']);
    }

    initializeChat();
});