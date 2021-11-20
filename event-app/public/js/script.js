// Password reveal
const passwordInput = document.querySelector("#password")
const buttonReveal = document.querySelector(".reveal")

buttonReveal.addEventListener("click", () => {
    if (passwordInput.getAttribute("type") === "password") {
        passwordInput.setAttribute("type", "text")
    } else {
        passwordInput.setAttribute("type", "password")
    }
})

// Password validation
const textHint = document.querySelector(".password-hint")

textHint.classList.add("hidden")

passwordInput.addEventListener("keyup", () => {
    textHint.classList.remove("hidden")

    const min = 6

    if (passwordInput.value.length < min) {
        textHint.innerText = `Only ${min - passwordInput.value.length} characters left`
    } else {
        textHint.innerText = "Password is good"
    }
})