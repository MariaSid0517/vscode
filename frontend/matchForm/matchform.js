document.addEventListener("DOMContentLoaded", () => {
    // Auto-filled values (simulated database response)
    const volunteerData = {
        name: "Aisha Khan",
        matchedEvent: "Community Food Drive"
    };

    // Fill input fields directly
    document.getElementById("volunteerName").value = volunteerData.name;
    document.getElementById("matchedEvent").value = volunteerData.matchedEvent;
});
