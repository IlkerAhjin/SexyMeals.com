const grid = document.getElementById("Rezept-Grid");
const Status = document.getElementById("Statusmeldung");
const uebersicht = document.getElementById("uebersicht");
const detailAnsicht = document.getElementById("Detailansicht");
const detailContainer = document.getElementById("rezept-detail");



document.getElementById("such-form").addEventListener("submit", (e) => {e.preventDefault()
loadInitialMeals(document.getElementById("such-input").value)
});

function rendermeals(meals) {
  grid.innerHTML="";
  if (meals === null || meals.length === 0) {
    document.getElementById("Statusmeldung").textContent = "kein Gericht gefunden";
    return;
  }else {
    Status.innerHTML = "";
    meals.forEach((meal) => {
      let card = document.createElement("div")
      let cardbody = document.createElement("div")
      cardbody.className = "cardbody"
      card.className = "card";
      card.dataset.id = meal.idMeal
      card.innerHTML += `<img src="${meal.strMealThumb}" alt={...}>`;
      cardbody.innerHTML += `<h3>${meal.strMeal}</h3>`;
      cardbody.innerHTML += `<p>${meal.strArea||""}</p>`;
      cardbody.innerHTML += `<p>${meal.strCategory||""}</p>`;
      card.addEventListener("click", async () =>{  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        let data = await res.json();
        if (data.meals) {
          showRecipeDetail(data.meals[0]);}})
      card.appendChild(cardbody)
      grid.appendChild(card)
    })
  }
}
async function loadInitialMeals(suchbegriff="a") {
  Status.textContent = "Gerichte werden geladen...";
  try {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${suchbegriff}`)
    let data = await response.json()
    console.log(data)
    rendermeals(data.meals);
  }
  catch (error) {
  Status.textContent = "Fehler Beim Laden der rezepte...";
  }
}

async function Kategories() {
  try {
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let data = await response.json();

    const kategorieContainer = document.getElementById("kategorie");
    kategorieContainer.innerHTML = "";


    let alleButton = document.createElement("button");
    alleButton.textContent = "Alle";
    alleButton.addEventListener("click", () => {
      loadInitialMeals("a");
    });
    kategorieContainer.appendChild(alleButton);

    data.categories.forEach((cat) => {
      let button = document.createElement("button");
      button.textContent = cat.strCategory;


      button.addEventListener("click", async () => {
        Status.textContent = "Lade Kategorie...";
        let filterRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat.strCategory}`);
        let filterData = await filterRes.json();
        rendermeals(filterData.meals);
      });

      kategorieContainer.appendChild(button);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Kategorien:", error);
  }
}
function showRecipeDetail(meal) {

  let zutatenHtml = "";
  for (let i = 1; i <= 20; i++) {
    let zutat = meal[`strIngredient${i}`];
    let menge = meal[`strMeasure${i}`];

    if (zutat && zutat.trim() !== "") {
      zutatenHtml += `<li>${menge ? menge : ""} ${zutat}</li>`;
    }
  }

  detailContainer.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <p><strong>Küche:</strong> ${meal.strArea || ""} | <strong>Kategorie:</strong> ${meal.strCategory || ""}</p>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; max-width:400px; border-radius:12px;">

    ${meal.strYoutube ? `<p><a href="${meal.strYoutube}" target="_blank">→ Video ansehen</a></p>` : ""}

    <h3>Zutaten</h3>
    <ul>${zutatenHtml}</ul>

    <h3>Zubereitung</h3>
    <p style="white-space: pre-line;">${meal.strInstructions}</p>
  `;

  uebersicht.classList.add("hidden");
  detailAnsicht.classList.remove("hidden");
}
document.getElementById("zufalls-knopf").addEventListener("click", async () => {
  let res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  let data = await res.json();
  if (data.meals) {
    showRecipeDetail(data.meals[0]);
  }
});

const burgerBtn = document.getElementById("burger-btn");
const navLinks = document.getElementById("nav-links");

if (burgerBtn && navLinks) {
  burgerBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const zurueckBtn = document.getElementById("zurueck");


zurueckBtn.addEventListener("click", () => {
  detailAnsicht.classList.add("hidden");
  uebersicht.classList.remove("hidden");
});
Kategories()
loadInitialMeals()

