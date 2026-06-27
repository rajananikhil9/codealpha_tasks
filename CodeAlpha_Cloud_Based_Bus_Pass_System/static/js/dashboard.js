let revenueChart = null;

/* Load Dashboard */

async function loadDashboard() {

const res = await fetch(
    "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/passes"
);

const passes = await res.json();

document.getElementById("totalPasses").innerText =
    passes.length;

document.getElementById("totalUsers").innerText =
    passes.length;

let revenue = 0;
let active = 0;
let pending = 0;
let rejected = 0;
let expired = 0;

const routes = new Set();

passes.forEach(pass => {

    revenue += Number(pass.price || 0);

    routes.add(pass.route);

    switch (pass.status) {

        case "Active":
            active++;
            break;

        case "Pending":
            pending++;
            break;

        case "Rejected":
            rejected++;
            break;

        case "Expired":
            expired++;
            break;
    }

});

document.getElementById("totalRevenue").innerText = "₹" + revenue;

document.getElementById("totalUsers").innerText = passes.length;

document.getElementById("totalPasses").innerText = passes.length;

document.getElementById("activePasses").innerText = active;

document.getElementById("pendingCount").innerText = pending;

document.getElementById("rejectedCount").innerText = rejected;

document.getElementById("expiredPasses").innerText = expired;

const routeRes = await fetch(
    "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/routes"
);

const routeData = await routeRes.json();

document.getElementById("totalRoutes").innerText =
    routeData.length;

loadRecentPasses(passes);


drawChart(
    ["Revenue"],
    [revenue]
);
}


/* Recent Passes */


function loadRecentPasses(passes) {

    const tbody =
        document.getElementById("recentPasses");

    tbody.innerHTML = "";

    passes.slice(-10).reverse().forEach(pass => {

        tbody.innerHTML += `
        <tr>
            <td>${pass.pass_id}</td>
            <td>${pass.name}</td>
            <td>${pass.serviceType}</td>
            <td>${pass.validity}</td>
            <td>${pass.status}</td>
        </tr>
        `;
    });
    
}

/* Revenue Chart */

function drawChart(labels, values) {

    const canvas = document.getElementById("revenueChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (revenueChart) {
        revenueChart.destroy();
    }

    revenueChart = new Chart(ctx, {
        type: "bar",

        data: {
            labels: labels,

            datasets: [{
                label: "Revenue (₹)",
                data: values,
                backgroundColor: "#2563eb",
                borderRadius: 8
            }]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

/* Auto Refresh */

loadDashboard();

setInterval(() => {
    loadDashboard();
}, 3000);

