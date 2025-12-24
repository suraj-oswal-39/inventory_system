// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Select all checkboxes inside .li elements
    const checkboxes = document.querySelectorAll('.li input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        // Each checkbox listens for a "change" (checked/unchecked)
        checkbox.addEventListener('change', function () {
            // Finds the .info div that comes right after the current .li
            const infoDiv = this.parentElement.nextElementSibling;

            if (this.checked) {
                // Show info
                infoDiv.style.maxHeight = infoDiv.scrollHeight + "px";
                infoDiv.style.opacity = "1";
            } else {
                // Hide info
                infoDiv.style.maxHeight = "0px";
                infoDiv.style.opacity = "0";
            }
        });
    });
});