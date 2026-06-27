loadRoutes();

async function loadRoutes() {
  const response = await fetch(
    "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/routes",
  );

  const routes = await response.json();

  const table = document.getElementById("routeTable");

  table.innerHTML = "";

  routes.forEach((route) => {
    table.innerHTML += `
        <tr>

            <td>${route.route_id}</td>

            <td>${route.route_name}</td>

            <td>${route.source}</td>

            <td>${route.destination}</td>

            <td>${route.distance} KM</td>

            <td>₹${route.daily_fare}</td>

            <td>₹${route.weekly_fare}</td>

            <td>₹${route.monthly_fare}</td>

            <td>

                <button
                class="delete-btn"
                onclick="deleteRoute('${route.route_id}')">

                    Delete

                </button>

            </td>

        </tr>
        `;
  });
}

async function addRoute() {

    try {

        const response = await fetch(
            "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/routes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    route_name: routeName.value,
                    source: source.value,
                    destination: destination.value,
                    distance: Number(distance.value),
                    daily_fare: Number(dailyFare.value),
                    weekly_fare: Number(weeklyFare.value),
                    monthly_fare: Number(monthlyFare.value)
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            alert("Failed to add route");
            return;
        }

        alert("Route Added Successfully");

        loadRoutes();

    } catch (err) {

        console.error(err);

        alert("Error adding route");

    }

}

async function deleteRoute(routeId) {

    if (!confirm("Delete this route?")) return;

    const response = await fetch(
        "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/routes/" + routeId,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    console.log(data);

    loadRoutes();
}
