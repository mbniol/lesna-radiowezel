const new_pattern_form = document.querySelector("#pattern_form");
const button = new_pattern_form.querySelector("button");

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const params = new FormData(new_pattern_form);
  console.log(params);
  await fetch("/api/pattern", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // "Content-Type": "multipart/form-data",
    },
    body: new URLSearchParams(params),
  });
  location.reload();
});

(async () => {
  const adminWrapper = document.querySelector(".admin-presets");
  const result = await fetch("/api/pattern");
  const json = await result.json();
  json.forEach((row) => {
    adminWrapper.innerHTML += generateElement(row);
  });
  console.log(json);
  const removeButtons = document.querySelectorAll(".preset-remove-button");
  const makeActiveButtons = document.querySelectorAll(
    ".preset-make-active-button"
  );

  removeButtons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await fetch(`/api/pattern/${id}`, {
        method: "DELETE",
      });
      location.reload();
    });
  });

  makeActiveButtons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await fetch(`/api/pattern/${id}/active`, {
        method: "PUT",
      });
      location.reload();
    });
  });

  const buttons = [...document.getElementsByClassName("preset-header-button")];
  const settingBox = [
    ...document.getElementsByClassName("preset-quick-settings"),
  ];

  console.log(buttons, document.getElementsByClassName("preset-header-button"));

  buttons.forEach((element, i) => {
    element.addEventListener("click", (e) => {
      console.log(i);
      classes = settingBox[i].classList;
      classes.toggle("visible");
    });
  });

  window.addEventListener("click", (e) => {
    if (
      !(
        e.target.classList.contains("preset-quick-settings") ||
        e.target.parentNode.classList.contains("preset-quick-settings") ||
        e.target.classList.contains("preset-header-button")
      )
    ) {
      settingBox.forEach((element) => {
        element.classList.remove("visible");
      });
    }
  });
})();

function generateElement({ id, name, alarm_offset, active, breaks_count }) {
  return `
  <div class="preset-box">
    <div class="preset-quick-settings">
      <button class="preset-remove-button" data-id="${id}">Usuń</button>
      <button class="preset-make-active-button" data-id="${id}">Ustaw jako aktywny</button>
    </div>
    <div class="preset-header">
      <a href="/admin/pattern/${id}"
        ><div class="preset-name">${name}</div></a
      >
      <div class="preset-header-button">&#9998;</div>
    </div>
    <div class="preset-info">Liczba przerw: ${breaks_count}</div>
    <div class="preset-info">Przesunięcie przerw: ${alarm_offset}s</div>
    <div class="preset-isselected preset-selected">${
      active ? "Aktywne" : "Nieaktywne"
    }</div>
  </div>`;
}