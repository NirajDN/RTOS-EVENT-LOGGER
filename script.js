const socket = new WebSocket("ws://localhost:3000");

const logsSection = document.getElementById("logContainer");
const pastEventsList = document.getElementById("eventList");
const manualLogBtn = document.getElementById("logEvent");

manualLogBtn.addEventListener("click", () => {
  const now = new Date().toLocaleString();
  const newListItem = document.createElement("li");
  newListItem.textContent = `Event Logged: ${now}`;
  pastEventsList.prepend(newListItem);
  storeLocally(newListItem.textContent);
});

socket.onmessage = (e) => {
  try {
    const info = JSON.parse(e.data);

    const newLogEntry = document.createElement("div");
    newLogEntry.innerHTML = `
      <strong>${info.timestamp}</strong><br>
      OS: ${info.operatingSystem} | CPU Usage: ${info.cpuUsage} | Free Memory: ${info.freeMemory}<br>
      Event: ${info.securityEvent}
    `;

    logsSection.prepend(newLogEntry);
  } catch (err) {
    console.warn("Failed to parse incoming message:", err);
  }
};

function storeLocally(text) {
  const existingLogs = JSON.parse(localStorage.getItem("eventLogs") || "[]");
  existingLogs.unshift(text);
  localStorage.setItem("eventLogs", JSON.stringify(existingLogs));
}

window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("eventLogs") || "[]");
  for (let entry of saved) {
    const li = document.createElement("li");
    li.textContent = entry;
    pastEventsList.appendChild(li);
  }
});
