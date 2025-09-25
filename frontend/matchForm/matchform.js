document.addEventListener("DOMContentLoaded", () => {
    // Auto-filled values (simulated database response)

    // Fill input fields directly
    document.getElementById("volunteerName").value = volunteerData.name;
    document.getElementById("matchedEvent").value = volunteerData.matchedEvent;
});

document.getElementById("volunteerForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const volunteer = document.getElementById("volunteerName").value;
    const event = document.getElementById("matchedEvent").value;

    if (volunteer && event) {
        alert(`Confirmed: ${volunteer} matched to ${event}`);
    } else {
        alert("Please select both a volunteer and an event before confirming.");
    }
});

