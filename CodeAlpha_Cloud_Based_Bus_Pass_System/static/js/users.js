let allUsers = [];

// ===============================
// LOAD USERS
// ===============================

async function loadUsers() {

    try {

        const response = await fetch(
            "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/passes"
        );

        allUsers = await response.json();

        displayUsers(allUsers);

    } catch (err) {

        console.error(err);

        alert("Unable to load users.");

    }

}

loadUsers();

// ===============================
// DISPLAY USERS
// ===============================

function displayUsers(users) {

    const table = document.getElementById("userTable");

    table.innerHTML = "";

    users.forEach(user => {

        table.innerHTML += `
        <tr>

            <td>${user.pass_id}</td>

            <td>${user.name}</td>

            <td>${user.email}</td>

            <td>${user.mobile}</td>

            <td>${user.route}</td>

            <td>${user.validity}</td>

            <td>${user.status}</td>

            <td>

                <button
                    onclick="viewUser('${user.pass_id}')">
                    View
                </button>

            </td>

        </tr>
        `;

    });

}

// ===============================
// SEARCH USERS
// ===============================

function searchUsers() {

    const keyword = document
        .getElementById("searchUser")
        .value
        .toLowerCase();

    const filtered = allUsers.filter(user =>

        user.name.toLowerCase().includes(keyword) ||

        user.email.toLowerCase().includes(keyword) ||

        user.mobile.toLowerCase().includes(keyword) ||

        user.pass_id.toLowerCase().includes(keyword)

    );

    displayUsers(filtered);

}

// ===============================
// VIEW USER
// ===============================

function viewUser(passId) {

    window.location =
        "/track?pass=" + passId;

}