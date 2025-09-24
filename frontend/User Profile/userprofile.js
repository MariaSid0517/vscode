function addDate() {
  const container = document.getElementById("availability-container");
  const input = document.createElement("input");
  input.type = "date";
  input.name = "availability[]";
  container.appendChild(document.createElement("br"));
  container.appendChild(input);
}
