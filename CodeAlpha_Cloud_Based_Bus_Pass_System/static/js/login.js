
async function login(){

    const username =
    document.getElementById(
        "username"
    ).value;

    const password =
    document.getElementById(
        "password"
    ).value;

    const response =
    await fetch("/admin/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            username,
            password
        })

    });

    const data =
    await response.json();

    if(data.success){

        localStorage.setItem(
            "adminLoggedIn",
            true
        );

        window.location =
        "/admin/dashboard";

    }

    else{

        message.innerHTML =
        "Invalid Credentials";

    }

}

