document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("test-button");
    const message = document.getElementById("welcome-message");

    button.addEventListener("click", () => {
        message.textContent = "🎉 Button clicked! Everything is working perfectly.";
        button.disabled = true;
    });
});
