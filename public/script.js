const statusText = document.getElementById("status");

function showStatus(message) {
  statusText.textContent = message;
  setTimeout(() => statusText.textContent = "", 2000);
}

function loadUsers() {
  fetch("/users")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("userList");
      list.innerHTML = "";
      data.forEach(user => {
        list.innerHTML += `
          <li>
            <input id="name-${user.id}" value="${user.name}">
            <input id="email-${user.id}" value="${user.email}">
            <button onclick="updateUser(${user.id})">Update</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </li>`;
      });
    });
}

function addUser() {
  fetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value
    })
  }).then(() => {
    showStatus("User added successfully");
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    loadUsers();
  });
}

function updateUser(id) {
  fetch(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById(`name-${id}`).value,
      email: document.getElementById(`email-${id}`).value
    })
  }).then(() => {
    showStatus("User updated successfully");
    loadUsers();
  });
}

function deleteUser(id) {
  fetch(`/users/${id}`, { method: "DELETE" })
    .then(() => {
      showStatus("User deleted successfully");
      loadUsers();
    });
}

loadUsers();
function searchUsers() {
  const query = document.getElementById("search").value.toLowerCase();
  const items = document.querySelectorAll("#userList li");

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? "" : "none";
  });
}
