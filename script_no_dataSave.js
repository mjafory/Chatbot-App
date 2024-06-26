document.addEventListener("DOMContentLoaded", function() {
    const chatboxBody = document.getElementById("chatbox-body");
    const preMadeQuestionsContainer = document.querySelector(".pre-made-questions");

    // Pre-made questions
    const preMadeQuestions = [
        "How can I reset my password?",
        "I have an issue with report submission.",
        "What is the support email?",
        "Where can I find the instructions page?"
    ];

    // Display pre-made questions
    preMadeQuestions.forEach(question => {
        const button = document.createElement("button");
        button.innerText = question;
        button.onclick = () => handleQuestion(question);
        preMadeQuestionsContainer.appendChild(button);
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
        chatboxBody.appendChild(messageElement);
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
    }

    // Function to handle questions
    function handleQuestion(question) {
        addMessage(question, "user");

        let response = "I'm not sure how to help with that.";

        // Convert the question to lower case for easier keyword matching
        const lowerCaseQuestion = question.toLowerCase();

        if (lowerCaseQuestion.includes("password")) {
            response = "To reset your password, please visit the password reset page at [Password Reset Page](#).";
        } else if (lowerCaseQuestion.includes("report")) {
            response = "Please specify the type of report issue:\nA. Unable to upload\nB. Format error\nC. Missing fields\nD. Permission denied\nE. Other issues";
        } else if (lowerCaseQuestion.includes("support email") || lowerCaseQuestion.includes("email")) {
            response = "You can reach our support team at support@example.com.";
        } else if (lowerCaseQuestion.includes("instructions")) {
            response = "The instructions page can be found at [Instructions Page](#).";
        } else if (question.match(/^[abcde]\. /i)) {
            response = "Thank you for your feedback. Our team will assist you with the issue.";
        }

        setTimeout(() => addMessage(response, "bot"), 1000);
    }
});
