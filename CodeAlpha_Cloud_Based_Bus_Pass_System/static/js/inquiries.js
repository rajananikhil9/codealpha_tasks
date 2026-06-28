
loadInquiries();

async function loadInquiries(){

    const response =
    await fetch("/api/inquiries");

    const inquiries =
    await response.json();

    let table =
    document.getElementById(
        "inquiryTable"
    );

    table.innerHTML = "";

    inquiries.forEach(item => {

        table.innerHTML += `
        <tr>

            <td>${item.id}</td>

            <td>${item.name}</td>

            <td>${item.email}</td>

            <td>${item.message}</td>

            <td>${item.created_at}</td>

            <td>

                <button
                class="delete-btn"
                onclick="deleteInquiry(${item.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;
    });
}

async function deleteInquiry(id){

    await fetch(
        "/api/inquiries/" + id,
        {
            method:"DELETE"
        }
    );

    loadInquiries();
}

