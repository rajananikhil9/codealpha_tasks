let allPasses = [];

// ===============================
// LOAD PASSES
// ===============================

fetch("https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/passes")
.then((res) => res.json())
.then((data) => {
console.log("API Data:", data);


allPasses = data;

displayPasses(data);

document.getElementById("totalPasses").innerText = data.length;


})
.catch((err) => {
console.error("ERROR:", err);
});

// ===============================
// DISPLAY PASSES
// ===============================

function displayPasses(data) {
const tbody = document.querySelector("#passTable tbody");

tbody.innerHTML = "";

data.forEach((pass) => {
tbody.innerHTML += ` <tr> <td>${pass.pass_id}</td> <td>${pass.name}</td> <td>${pass.email}</td> <td>${pass.mobile}</td> <td>${pass.route}</td> <td>₹${pass.price}</td>


    <td style="
      color:
        ${pass.status === "Active"
          ? "green"
          : pass.status === "Rejected"
          ? "red"
          : "orange"};
      font-weight:bold;
    ">
      ${pass.status}
    </td>

    <td>
      ${
        pass.status === "Pending"
          ? `
          <button
            onclick="approvePass('${pass.pass_id}')"
            style="background:green;color:white;"
          >
            ✓ Approve
          </button>

          <button
            onclick="rejectPass('${pass.pass_id}')"
            style="background:red;color:white;"
          >
            ✗ Reject
          </button>
          `
          : "-"
      }
    </td>

    <td>
      <a href="${pass.qr_url}" target="_blank">
        View QR
      </a>
    </td>
  </tr>
`;


});
}

// ===============================
// SEARCH
// ===============================

function searchPass() {
const keyword = document
.getElementById("searchInput")
.value
.toLowerCase();

const filtered = allPasses.filter(
(pass) =>
pass.pass_id.toLowerCase().includes(keyword) ||
pass.name.toLowerCase().includes(keyword) ||
pass.route.toLowerCase().includes(keyword)
);

displayPasses(filtered);
}

// ===============================
// APPROVE PASS
// ===============================

async function approvePass(passId) {
try {
await fetch(
`https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/approve/${passId}`,
{
method: "PUT"
}
);


location.reload();


} catch (err) {
console.error(err);
alert("Failed to approve pass");
}
}

// ===============================
// REJECT PASS
// ===============================

async function rejectPass(passId) {
try {
await fetch(
`https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/reject/${passId}`,
{
method: "PUT"
}
);


location.reload();


} catch (err) {
console.error(err);
alert("Failed to reject pass");
}
}

// ===============================
// DELETE PASS
// ===============================

async function deletePass(passId) {
if (!confirm("Delete this pass?")) return;

try {
await fetch(
`https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/pass/${passId}`,
{
method: "DELETE"
}
);


location.reload();


} catch (err) {
console.error(err);
}
}
