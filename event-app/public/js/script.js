// Delete account modal
const modalDelete = document.querySelector("#modal-delete")

const toggleModal = () => modalDelete.classList.toggle("hidden")

// Password reveal
const passwordInput = document.querySelector("#password")
const buttonReveal = document.querySelector(".reveal")
const iconReveal = document.querySelector(".icon-reveal use")

if (buttonReveal) {
    iconReveal.setAttribute("xlink:href", "/images/icon-sprite.svg#show-slash")
    buttonReveal.addEventListener("click", () => {
        if (passwordInput.getAttribute("type") === "password") {
            passwordInput.setAttribute("type", "text")
            iconReveal.setAttribute(
                "xlink:href",
                "/images/icon-sprite.svg#show-slash"
            )
        } else {
            passwordInput.setAttribute("type", "password")
            iconReveal.setAttribute(
                "xlink:href",
                "/images/icon-sprite.svg#show"
            )
        }
    })
}

// Password validation
const textHint = document.querySelector(".password-hint")

if (textHint) {
    textHint.classList.add("hidden")

    passwordInput.addEventListener("keyup", () => {
        textHint.classList.remove("hidden")

        const min = 6

        if (passwordInput.value.length < min) {
            textHint.innerText = `Only ${
                min - passwordInput.value.length
            } characters left`
        } else {
            textHint.innerText = "Password is good"
        }
    })
}

// Min date
const startDate = document.querySelector("#startDate")
const endDate = document.querySelector("#endDate")
let today = new Date()
const dd = today.getDate()
const mm = today.getMonth() + 1
const yy = today.getFullYear()

console.log(`Day: ${dd}, Month: ${mm}, Year: ${yy}`)

if (dd < 10) {
    dd = "0" + dd
}

if (mm < 10) {
    mm = "0" + mm
}

today = `${yy}-${mm}-${dd}`

if (startDate) {
    startDate.setAttribute("min", today)
}

if (endDate) {
    endDate.setAttribute("min", today)

    startDate.addEventListener("change", () => {
        endDate.setAttribute("min", startDate.value)
    })
}
