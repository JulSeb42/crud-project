// Delete account modal
const buttonDelete = document.querySelector(".delete-account")
const modalDelete = document.querySelector("#modal-delete")
const cancelDelete = document.querySelector("#cancel-delete")
modalDelete.classList.add("hidden")

buttonDelete.addEventListener("click", () => {
    modalDelete.classList.remove("hidden")
})

cancelDelete.addEventListener("click", () => {
    modalDelete.classList.add("hidden")
})

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
        textHint.innerText = `Only ${min - passwordInput.value.length
            } characters left`
    } else {
        textHint.innerText = "Password is good"
    }
})
