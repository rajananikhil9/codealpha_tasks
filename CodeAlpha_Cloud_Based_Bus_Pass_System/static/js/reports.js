let revenueChart;
let routeChart;

loadReports();

async function loadReports() {

    try {

        const response = await fetch(
            "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/passes"
        );

        const passes = await response.json();

        let revenue = 0;
        let active = 0;

        const routeCounts = {};

        passes.forEach(pass => {

            revenue += Number(pass.price || 0);

            if (pass.status === "Active")
                active++;

            if (routeCounts[pass.route])
                routeCounts[pass.route]++;
            else
                routeCounts[pass.route] = 1;

        });

        document.getElementById("reportRevenue").innerText =
            "₹" + revenue;

        document.getElementById("reportPasses").innerText =
            passes.length;

        document.getElementById("reportActive").innerText =
            active;

        document.getElementById("reportRoutes").innerText =
            Object.keys(routeCounts).length;

        drawRevenueChart(
            ["Revenue"],
            [revenue]
        );

        drawRouteChart(
            Object.keys(routeCounts),
            Object.values(routeCounts)
        );

    } catch (err) {

        console.error(err);

        alert("Unable to load reports.");

    }

}

function drawRevenueChart(labels, values) {

    if (revenueChart)
        revenueChart.destroy();

    revenueChart = new Chart(

        document.getElementById("monthlyRevenue"),

        {
            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Revenue",

                    data: values

                }]

            },

            options: {

                responsive: true

            }

        }

    );

}

function drawRouteChart(labels, values) {

    if (routeChart)
        routeChart.destroy();

    routeChart = new Chart(

        document.getElementById("routeChart"),

        {
            type: "pie",

            data: {

                labels: labels,

                datasets: [{

                    data: values

                }]

            },

            options: {

                responsive: true

            }

        }

    );

}

function exportPDF() {

    alert("PDF Export will be added using AWS Lambda.");

}

function exportExcel() {

    alert("Excel Export will be added using AWS Lambda.");

}