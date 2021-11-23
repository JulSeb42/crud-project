const body = document.body

// Dropdown navbar
const buttonNavbar = document.querySelector(".nav-account button")
const dropdownNav = document.querySelector(".nav-account ul")

if (buttonNavbar) {
    buttonNavbar.addEventListener("click", () => {
        dropdownNav.classList.toggle("open")
    })

    const nameContainer = buttonNavbar.querySelector("span")

    const firstName = nameContainer.innerText.split(" ")[0]
    console.log(firstName)

    nameContainer.innerText = firstName
}

// Delete account modal
const modalDelete = document.querySelector("#modal-delete")
const buttonDelete = document.querySelector("#btnModal")
const buttonCancelModal = document.querySelector("#cancelDelete")

if (buttonDelete) {
    modalDelete.classList.add("hidden")

    buttonDelete.addEventListener("click", () => {
        modalDelete.classList.toggle("hidden")
        // body.classList.toggle("stop-scrolling")
    })

    buttonCancelModal.addEventListener("click", () => {
        modalDelete.classList.toggle("hidden")
        // body.classList.toggle("stop-scrolling")
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
    startDate.setAttribute("value", today)
}

if (endDate) {
    endDate.setAttribute("min", today)
    endDate.setAttribute("value", today)

    startDate.addEventListener("change", () => {
        endDate.setAttribute("min", startDate.value)
        endDate.setAttribute("value", startDate.value)
    })
}

let nowDate = new Date()
let nowHour = nowDate.getHours()
let nowMinute = nowDate.getMinutes()

const startTime = document.querySelector("#startTime")
const endTime = document.querySelector("#endTime")

if (startTime) {
    startTime.setAttribute("value", `${nowHour}:${nowMinute}`)
}

if (endTime) {
    endTime.setAttribute(
        "value",
        `${nowHour < 24 ? nowHour + 1 : "00"}:${nowMinute}`
    )

    startTime.addEventListener("change", () => {
        const time = startTime.value
        const splitted = time.split(":")
        endTime.setAttribute(
            "value",
            `${
                parseInt(splitted[0]) < 23 ? parseInt(splitted[0]) + 1 : "00"
            }:${nowMinute}`
        )
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

// Display new profile picture
const profilePicture = document.querySelector(".label-avatar-picture img")
const inputPicture = document.querySelector("#avatar")

if (profilePicture) {
    inputPicture.addEventListener("change", () => {
        const file = inputPicture.files[0]
        const url = URL.createObjectURL(file)

        profilePicture.setAttribute("src", url)
    })
}

// Helper bio
const bioArea = document.querySelector("#bio")
const bioHelper = document.querySelector("#helper-bio")

if (bioArea) {
    bioHelper.innerText = `${bioArea.value.length}/140`

    bioArea.addEventListener("keyup", () => {
        bioHelper.innerText = `${bioArea.value.length}/140`
    })
}