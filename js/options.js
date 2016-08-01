var temp = document.querySelector("#temp");
var displayAllLanguagesCheckbox = document.querySelector("#display-all-languages");
displayAllLanguagesCheckbox.addEventListener("change", function (event) {
    temp.textContent = displayAllLanguagesCheckbox.checked;
    temp.textContent = "fuck";
});
