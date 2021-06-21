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

  let item = info[0]
  
  displayDiv.innerHTML = `
  <div id="destroyMe">
    <h3>${item.name}</h3>
    <p>Year made: ${item.year_built}</p>
    <p>Home Port: ${item.home_port}</p>
    <p>Type: ${item.type}</p>
    <p>Weight: ${item.mass_kg} kg</p>
    <p>Roles:</p>
    <div id="rolesDiv"> </div>
    <img src="${item.img}" alt="">
    <div>
      <button id="backBtn">Back</button>
      <button id="favouriteBtn">Add To Favourites</button>
    </div>
  </div>
  `
  let p = document.createElement("p");
  for (i = 0; i < item.roles.length; i++) {
    if (i < item.roles.length -1){
      p.innerHTML += `${item.roles[i]}, `;
    }
    else{
      p.innerHTML += item.roles[i];
    }
    document.querySelector("#rolesDiv").appendChild(p);
  }
  document.getElementById("backBtn").addEventListener("click", (e) => {
    document.getElementById("destroyMe").remove();
    getShipNames();
  });
  document.getElementById("favouriteBtn").addEventListener("click", (e) => {
    addToFavorite(item.name);
  });
  
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
