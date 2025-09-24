document.addEventListener("DOMContentLoaded", () => {
    const volunteerInput = document.getElementById("volunteerName");
    const eventInput = document.getElementById("matchedEvent");

    // Simulated database response
    const volunteerData = {
        name: "Aisha Khan",
        matchedEvent: "Community Food Drive"
    };

    // Auto-fill fields
    volunteerInput.value = volunteerData.name;
    eventInput.value = volunteerData.matchedEvent;

    // Handle form submission
    document.getElementById("volunteerForm").addEventListener("submit", (e) => {
        e.preventDefault();
        alert(`Confirmed: ${volunteerInput.value} matched to ${eventInput.value}`);
    });
});
