const url = 'https://forms.gle/uayCLqgECcaxmxE66';

const notificationTimer = 3;

var interactPopup;
document.addEventListener("DOMContentLoaded", (event) => {
  interactPopup = document.getElementsByClassName("connectionPopup")[0];
});

function OpenContactForm() {
    window.open(url, '_blank').focus();
}

function InteractNotification(text)
{
    interactPopup.innerText = text;
    interactPopup.style.display = "block";

    setTimeout(() => {
        interactPopup.style.display = "none";
    }, notificationTimer * 1000);
}
