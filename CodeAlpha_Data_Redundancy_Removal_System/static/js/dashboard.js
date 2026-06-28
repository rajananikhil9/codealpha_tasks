console.log("Dashboard JS Loaded");
async function loadStats() {
    try {
        const response = await fetch("/api/records/stats");
        const data = await response.json();

        console.log("Stats:", data);

        document.getElementById("total").textContent = data.total;
        document.getElementById("unique").textContent = data.unique;
        document.getElementById("duplicate").textContent = data.duplicates;
    } catch (err) {
        console.error(err);
    }
}

window.onload = function () {
    loadStats();
};

async function addRecord() {

    const token = localStorage.getItem("token");

    const response = await fetch("/api/records/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        })
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("message").innerHTML =
            "<span style='color:green'>" + data.message + "</span>";

        loadStats();

    } else {

        let msg = "<span style='color:red'>" + data.message + "</span>";

        if (data.similarity) {
            msg += "<br>Similarity: " + data.similarity + "%";
        }

        if (data.existing_record) {
            msg += "<br><b>Existing Record:</b>";
            msg += "<br>Name: " + data.existing_record.name;
            msg += "<br>Email: " + data.existing_record.email;
            msg += "<br>Phone: " + data.existing_record.phone;
        }

        document.getElementById("message").innerHTML = msg;
    }
}

function logout(){

    localStorage.removeItem("token");
    window.location="/";

}

loadStats();