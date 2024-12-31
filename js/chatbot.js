document.addEventListener("DOMContentLoaded", () => {
	const chatToggle = document.querySelector(".chat-toggle");
	const chatContainer = document.querySelector(".chat-container");
	const closeChat = document.querySelector(".close-chat");
	const messageInput = document.querySelector(".chat-input input");
	const sendButton = document.querySelector(".send-message");
	const messagesContainer = document.querySelector(".chat-messages");

	// Toggle chat window
	chatToggle.addEventListener("click", () => {
		chatContainer.classList.add("active");
		messageInput.focus();
	});

	closeChat.addEventListener("click", () => {
		chatContainer.classList.remove("active");
	});

	// Send message function
	function sendMessage(message, isUser = true) {
		const messageElement = document.createElement("div");
		messageElement.classList.add("message");
		messageElement.classList.add(isUser ? "user" : "bot");

		messageElement.innerHTML = `
            <div class="message-content">
                ${message}
            </div>
        `;

		messagesContainer.appendChild(messageElement);
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}

	// Simple bot response function
	function getBotResponse(userMessage) {
		const message = userMessage.toLowerCase().trim();

		// Explicit yes check first
		const yesVariations = [
			"yes",
			"yes please",
			"yes pls",
			"sure",
			"yep",
			"yeah",
		];
		if (yesVariations.some((variation) => message.includes(variation))) {
			return "Okay great, please can you either tell me your phone number or email address, or click on the 'get started' button to fill in the enquiry form. A member of our team will get back to you within 24 hours! Thankyou :)";
		}

		// Check for contact information
		const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
		const phoneRegex = /[\d\s()+.-]{8,}/;
		if (emailRegex.test(message) || phoneRegex.test(message)) {
			return "Thank you for providing your contact information. A member of our team will be in touch within 24 hours!";
		}

		// Initial greetings and inquiries
		if (message.includes("hello") || message.includes("hi")) {
			return "Hi there! Would you like to speak with our sales team?";
		}
		if (message.includes("help")) {
			return "I'd be happy to help! Would you like to speak with our sales team?";
		}
		if (message.includes("features")) {
			return "I can tell you about our features, but would you prefer to speak with our sales team for more detailed information?";
		}
		if (message.includes("pricing")) {
			return "Would you like to speak with our sales team about pricing options?";
		}
		if (message.includes("contact")) {
			return "Would you like to speak with our sales team? They can provide the best assistance.";
		}
		if (message.includes("bye")) {
			return "Goodbye! Have a great day!";
		}

		// Default response
		return "Would you like to speak with our sales team? They can best assist you with your inquiry.";
	}

	// Handle sending messages
	function handleSendMessage() {
		const message = messageInput.value.trim();
		if (message) {
			sendMessage(message);
			messageInput.value = "";

			// Simulate bot response after a short delay
			setTimeout(() => {
				const botResponse = getBotResponse(message);
				sendMessage(botResponse, false);
			}, 1000);
		}
	}

	// Send button click
	sendButton.addEventListener("click", handleSendMessage);

	// Enter key press
	messageInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	});
});
