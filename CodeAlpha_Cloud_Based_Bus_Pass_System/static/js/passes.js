console.log("passes.js loaded");

fetch("https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/passes")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    const tbody = document.getElementById("passTable");

    tbody.innerHTML = "";

    data.forEach((pass) => {
      tbody.innerHTML += `
        <tr>
            <td>${pass.pass_id}</td>
            <td>${pass.name}</td>
            <td>${pass.route}</td>
            <td>₹${pass.price}</td>
            <td>${pass.status}</td>
            <td><a href="${pass.qr_url}" target="_blank">QR</a></td>
            <td>

${
  pass.status === "Pending"
    ? `

<button
style="background:#28a745;color:white;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;"
onclick="approvePass('${pass.pass_id}')">
✅ Approve
</button>

<button
style="background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;margin-left:5px;"
onclick="rejectPass('${pass.pass_id}')">
❌ Reject
</button>

`
    : `<b>${pass.status}</b>`
}

</td>
        </tr>
        `;
    });
  })
  .catch((err) => console.error(err));


async function approvePass(id) {

    await fetch(
        `https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/approve/${id}`,
        {
            method: "PUT"
        }
    );

    location.reload();

}

async function rejectPass(id){

    await fetch(
        `https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/reject/${id}`,
        {
            method:"PUT"
        }
    );

    location.reload();

}