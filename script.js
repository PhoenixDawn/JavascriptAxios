let favourites = []

function getShipNames() {
  axios
    .get("https://api.spacexdata.com/v4/ships")
    .then((res) => displayAllShips(res.data))
    .catch((e) => console.error(e));
}

function displayAllShips(array) {
  let displayShips = document.getElementById("allShips");
  //   console.log(array.length())
  for (let item of array) {
    displayShips.innerHTML += `<li class="shipDisplay">${item.name}</li>`;
  }
  makeListItemsClickable();
  document.getElementById("display").style.zIndex = -1
  displayShips.style.zIndex = 1
}

function makeListItemsClickable() {
  let shipDisplays = document.querySelectorAll(".shipDisplay");
  for (i = 1; i <= shipDisplays.length; i++) {
    let ship = document.querySelector(`.shipDisplay:nth-child(${i})`);
    ship.addEventListener("click", (e) => {
      makeRequest(ship.innerHTML);
    });
  }
}

function makeRequest(search) {
  removeOldList();
  axios
    .post("https://api.spacexdata.com/v4/ships/query", {
      query: {
        name: search,
      },
      options: {},
    })
    .then((res) => {
      response = res.data.docs;
      displayData(res.data.docs);
    })
    .catch((err) => console.error(err));
}

function removeOldList() {
  let shipDisplayLength = document.querySelectorAll(".shipDisplay").length;
  for (i = 1; i <= shipDisplayLength; i++) {
    let ship = document.querySelector(`.shipDisplay:nth-child(1)`);
    ship.remove();
  }
  let infoDiv = document.querySelector("#destroyMe");
  if (infoDiv) {
    infoDiv.remove();
  }
}

// Display Information
function displayData(info) {
  let displayDiv = document.getElementById("display");
  for (item of info) {
    let div = document.createElement("div");
    let h3 = document.createElement("h3");
    let pYear = document.createElement("p");
    let pHomePort = document.createElement("p");
    let pType = document.createElement("p");
    let pWeight = document.createElement("p");
    let btnBack = document.createElement("button");
    let btnFav = document.createElement("button");

    let divRole = document.createElement("div");
    let pRoles = document.createElement("p");

    let image = document.createElement(`img`);

    //Display roles
    for (i = 0; i < item.roles.length; i++) {
      let p = document.createElement("p");
      console.log(item.roles[i]);
      p.innerHTML = item.roles[i];
      divRole.appendChild(p);
    }

    pYear.innerHTML = `Year made: ${item.year_built}`;
    pHomePort.innerHTML = `Home Port: ${item.home_port}`;
    pType.innerHTML = `Type: ${item.type}`;
    pRoles.innerHTML = "Roles:";
    pWeight.innerHTML = `Weight kg: ${item.mass_kg}`;
    btnBack.innerHTML = "Back";
    btnFav.innerHTML = "Add to favourite";
    image.src = item.image;

    h3.innerHTML = item.name;
    div.appendChild(h3);
    div.appendChild(pYear);
    div.appendChild(pHomePort);
    div.appendChild(pType);
    div.appendChild(pWeight);
    div.appendChild(pRoles);
    div.appendChild(divRole);
    div.appendChild(image);
    div.append(btnBack);
    div.append(btnFav);
    div.id = "destroyMe";
    displayDiv.append(div);

    //Add a back button
    btnBack.addEventListener("click", (e) => {
      div.remove();
      getShipNames();
    });
    btnFav.addEventListener("click", (e) => {
      addToFavorite(item.name);
    });
  }
  document.getElementById("allShips").style.zIndex = -1
  displayDiv.style.zIndex = 1
}

function addToFavorite(name) {
  if (favourites.includes(name)){
    alert(`You already have ${name} in your favourites!`)
    return
  }
  let favDiv = document.querySelector(".favorites");
  let li = document.createElement("li");
  let btn = document.createElement("button");
  li.innerHTML = `${name}`; // <button id='removeBtn'>REMOVE</button>`
  btn.innerHTML = `Remove`; // <button id='removeBtn'>REMOVE</button>`
  favDiv.append(li);
  favDiv.append(btn);

  li.addEventListener("click", (e) => {
    e.stopPropagation();
    makeRequest(name);
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    favourites.splice(favourites.indexOf(name), 1)
    btn.remove();
    li.remove();
  });
  favourites.push(name)
}

// Search Button Click
let searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchInput = document.querySelector("#search");

  makeRequest(searchInput.value);
});

getShipNames();
