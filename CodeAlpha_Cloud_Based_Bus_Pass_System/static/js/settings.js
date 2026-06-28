loadSettings();

async function loadSettings() {

    try {

        const response = await fetch("/api/settings");
        const data = await response.json();

        document.getElementById("siteName").value =
            data.site_name || "";

        document.getElementById("phone").value =
            data.phone || "";

        document.getElementById("email").value =
            data.email || "";

        document.getElementById("address").value =
            data.address || "";

        document.getElementById("banner").value =
            data.banner || "";

        document.getElementById("footer").value =
            data.footer || "";

    } catch (error) {

        console.error("Error loading settings:", error);

    }
}

async function saveSettings() {

    try {

        const response = await fetch("/api/settings", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                site_name: document.getElementById("siteName").value,

                phone: document.getElementById("phone").value,

                email: document.getElementById("email").value,

                address: document.getElementById("address").value,

                banner: document.getElementById("banner").value,

                footer: document.getElementById("footer").value

            })

        });

        const result = await response.json();

        if (result.success) {

            alert("Settings Saved Successfully");

        } else {

            alert("Failed to Save Settings");

        }

    } catch (error) {

        console.error("Error saving settings:", error);

        alert("Server Error");

    }
}