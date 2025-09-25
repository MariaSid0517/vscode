document.getElementById("historyForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const volunteer = document.getElementById("volunteerName").value.trim();
    const event = document.getElementById("eventName").value.trim();
    const date = document.getElementById("date").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();
    const requiredSkills = document.getElementById("requiredSkills").value;
    const urgency = document.getElementById("urgency").value;
    const status = document.getElementById("status").value;


    if (!volunteer || !event || !date || !location || !description || !requiredSkills || !urgency || !status) {
        alert("All fields are required.");
        return;
    }
    if (volunteer.length > 50 || event.length > 100 || location.length > 100 || description.length > 200) {
        alert("One or more fields exceed character limits.");
        return;
    }


    const table = document.getElementById("historyTable").querySelector("tbody");
    const newRow = table.insertRow();
    newRow.innerHTML = `
      <td>${volunteer}</td>
      <td>${event}</td>
      <td>${date}</td>
      <td>${location}</td>
      <td>${description}</td>
      <td>${requiredSkills}</td>
      <td>${urgency}</td>
      <td>${status}</td>
    `;


    this.reset();
    alert("Record added successfully!");
});
