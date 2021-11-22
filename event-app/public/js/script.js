// Delete account modal
const modalDelete = document.querySelector("#modal-delete")
const buttonDelete = document.querySelector("#btnModal")
// const toggleModal = () => modalDelete.classList.toggle("hidden")

if (buttonDelete) {
    buttonDelete.addEventListener("click", () => {
        modalDelete.classList.toggle("hidden")
    })
}

// Password reveal
const passwordInput = document.querySelector("#password")
const buttonReveal = document.querySelector(".reveal")
const iconReveal = document.querySelector(".icon-reveal use")

if (buttonReveal) {
    buttonReveal.addEventListener("click", () => {
        if (passwordInput.getAttribute("type") === "password") {
            passwordInput.setAttribute("type", "text")
            iconReveal.setAttribute(
                "xlink:href",
                "/images/icon-sprite.svg#show"
            )
        } else {
            passwordInput.setAttribute("type", "password")
            iconReveal.setAttribute(
                "xlink:href",
                "/images/icon-sprite.svg#show-slash"
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

// Toggle confidentiality
const textConfidentiality = document.querySelector("#textConfidentiality")
const checkboxConfidentiality = document.querySelector("#public")

if (textConfidentiality) {
    textConfidentiality.innerText = "Private"

    checkboxConfidentiality.addEventListener("click", () => {
        if (checkboxConfidentiality.checked) {
            checkboxConfidentiality.setAttribute("value", "public")
            textConfidentiality.innerText = "Public"
        } else {
            checkboxConfidentiality.setAttribute("value", "private")
            textConfidentiality.innerText = "Private"
        }
    })
}

// Filter invite
const listInvite = document.querySelector("#listInvite")

function searchFunction() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue
    input = document.querySelector("#searchInvite")
    filter = input.value.toUpperCase()
    ul = listInvite
    li = ul.querySelectorAll("li")

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        let name = li[i].querySelector(".name").innerText
        let txtValue = name

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = ""
        } else {
            li[i].style.display = "none"
        }
    }
}

if (listInvite) {
    searchFunction()
}
