async function loadRecords() {

    const response = await fetch("/api/records/all");

    const data = await response.json();

    displayRecords(data.records);
}


async function searchRecords() {

    const keyword = document.getElementById("search").value;

    const response = await fetch(
        "/api/records/search?keyword=" + encodeURIComponent(keyword)
    );

    const data = await response.json();

    displayRecords(data.records);
}


function displayRecords(records) {

    let output = "";

    records.forEach(record => {

        output += `
        <tr>
            <td>${record.name}</td>
            <td>${record.email}</td>
            <td>${record.phone}</td>
            <td>${record.status}</td>
            <td>${record.created_at}</td>
        </tr>
        `;

    });

    document.getElementById("recordsTable").innerHTML = output;
}

loadRecords();