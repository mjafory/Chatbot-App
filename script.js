document.addEventListener("DOMContentLoaded", function() {
    const chatboxBody = document.getElementById("chatbox-body");
    const preMadeQuestionsContainer = document.querySelector(".pre-made-questions");
    const modal = document.getElementById("chatbotModal");
    const openButton = document.getElementById("openChatbotButton");
    const closeButton = document.querySelector(".close");

    // Pre-made questions
    const preMadeQuestions = [
        "How can I reset my password?",
        "I have an issue with report submission.",
        "What is the support email?",
        "Where can I find the instructions page?"
    ];

    // To track displayed questions
    let displayedQuestions = new Set();

    // Load chat history from local storage
    loadChatHistory();

    // Display pre-made questions
    preMadeQuestions.forEach(question => {
        const button = document.createElement("button");
        button.innerText = question;
        button.onclick = () => handleQuestion(question);
        preMadeQuestionsContainer.appendChild(button);
        displayedQuestions.add(question.toLowerCase());
    });

    // Function to send a message
    window.sendMessage = function() {
        const userInput = document.getElementById("user-input");
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, "user");
            handleQuestion(message);
            userInput.value = "";
        }
    };

    // Function to add a message to the chatbox
    function addMessage(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.innerText = message;

        // Add delete button only to bot responses
        if (sender === "bot") {
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "❌";
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = () => {
                // Find the previous sibling, which is the user message
                const previousMessage = messageElement.previousElementSibling;
                if (previousMessage && previousMessage.classList.contains("user")) {
                    chatboxBody.removeChild(previousMessage); // Remove user message
                }
                chatboxBody.removeChild(messageElement); // Remove bot message
                saveChatHistory();
            };
            messageElement.appendChild(deleteButton);
        }

        chatboxBody.appendChild(messageElement);
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
        saveChatHistory();
    }


    // Function to handle questions
    function handleQuestion(question) {
        const lowerCaseQuestion = question.toLowerCase();

        // Check if the question has been displayed already
        if (displayedQuestions.has(lowerCaseQuestion)) {
            addMessage("You've already asked this question.", "bot");
            return;
        }

        addMessage(question, "user");

        let response = "I'm not sure how to help with that.";

        if (lowerCaseQuestion.includes("password")) {
            response = "To reset your password, please visit the password reset page at [Password Reset Page](#).";
        } else if (lowerCaseQuestion.includes("report")) {
            response = " ";
            addReportIssueOptions();
        } else if (lowerCaseQuestion.includes("support email") || lowerCaseQuestion.includes("email")) {
            response = "You can reach our support team at support@example.com.";
        } else if (lowerCaseQuestion.includes("instructions")) {
            response = "The instructions page can be found at [Instructions Page](#).";
        } else if (lowerCaseQuestion.match(/^[abcde]\. /i)) {
            response = "Thank you for your feedback. Our team will assist you with the issue.";
        }

        setTimeout(() => addMessage(response, "bot"), 1000);
        displayedQuestions.add(lowerCaseQuestion);
    }

    // Function to add report issue options
    function addReportIssueOptions() {
        const options = ["A. Unable to upload", "B. Format error", "C. Missing fields", "D. Permission denied", "E. Other issues"];
        options.forEach(option => {
            const button = document.createElement("button");
            button.innerText = option;
            button.onclick = () => {
                addMessage(option, "user");
                handleReportOption(option);
            };
            chatboxBody.appendChild(button);
        });
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
    }

    // Function to handle report issue options
    function handleReportOption(option) {
        let response = "Thank you for reporting this issue. ";

        switch (option.toLowerCase().charAt(0)) {
            case 'a':
                response += "Here is the solution for unable to upload issue.";
                break;
            case 'b':
                response += "Here is the solution for format error issue.";
                break;
            case 'c':
                response += "Here is the solution for missing fields issue.";
                break;
            case 'd':
                response += "Here is the solution for permission denied issue.";
                break;
            case 'e':
                response += "Here is the solution for other issues.";
                break;
            default:
                response = "I'm not sure how to help with that.";
                break;
        }

        setTimeout(() => addMessage(response, "bot"), 1000);
    }

    // Function to save chat history to local storage
    function saveChatHistory() {
        const messages = [];
        document.querySelectorAll(".chatbox-body .message").forEach(messageElement => {
            const sender = messageElement.classList.contains("user") ? "user" : "bot";
            const text = messageElement.firstChild.textContent;
            messages.push({ sender, text });
        });
        localStorage.setItem("chatHistory", JSON.stringify(messages));
    }

    // Function to load chat history from local storage
    function loadChatHistory() {
        const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatHistory.forEach(message => addMessage(message.text, message.sender));
    }

    // Function to clear chat history
    window.clearChatHistory = function() {
        chatboxBody.innerHTML = "";
        localStorage.removeItem("chatHistory");
        displayedQuestions.clear(); // Clear displayed questions set
    };

    // Open the modal
    openButton.onclick = function() {
        modal.style.display = "block";
    };

    // Close the modal
    closeButton.onclick = function() {
        modal.style.display = "none";
    };

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});
