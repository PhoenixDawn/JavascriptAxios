

axios
  .get("https://api.spacexdata.com/v4/ships")
  .then((res) => displayAllShips(res.data))
  .catch((e) => console.error(e));


function displayAllShips(array) {
  let displayShips = document.querySelector(".allShips");
//   console.log(array.length())
  for (let item of array) {
    displayShips.innerHTML += `<li class="shipDisplay">${item.name}</li>`;
  }
  makeListItemsClickable();
}

function makeListItemsClickable(){
    let shipDisplays = document.querySelectorAll(".shipDisplay")
    for(i = 1; i <= shipDisplays.length; i++){
        let ship = document.querySelector(`.shipDisplay:nth-child(${i})`)
        ship.addEventListener("click", (e) => {makeRequest(ship.innerHTML)})
    }
}


function makeRequest(search) {
    removeOldList()
  axios
    .post("https://api.spacexdata.com/v4/ships/query", {
      query: {
        name: search,
      },
      options: {},
    })
    .then((res) => {
      console.log(res.data.docs);
      response = res.data.docs;
      displayData(res.data.docs);
    })
    .catch((err) => console.error(err));
}

function removeOldList(){
    let shipDisplayLength = document.querySelectorAll(".shipDisplay").length
    for(i = 1; i <= shipDisplayLength; i++){
        let ship = document.querySelector(`.shipDisplay:nth-child(1)`)
        ship.remove()
    }
}

// Display Information
function displayData(info) {
  let displayDiv = document.querySelector(".display");
  for (item of info) {
    let div = document.createElement('div');
    let h3 = document.createElement('h3')
    let pYear = document.createElement('p')
    let pHomePort = document.createElement('p')
    let pType = document.createElement('p')
    let pWeight = document.createElement('p')

    let divRole = document.createElement("div")
    let pRoles = document.createElement("p")

    let image = document.createElement(`img`)

    //Display roles
    for(i =0; i < item.roles.length; i++){
        let p = document.createElement("p")
        console.log(item.roles[i])
        p.innerHTML = item.roles[i]
        divRole.appendChild(p)
        
    }
    
    pYear.innerHTML = `Year made: ${item.year_built}`
    pHomePort.innerHTML = `Home Port: ${item.home_port}`
    pType.innerHTML = `Type: ${item.type}`
    pRoles.innerHTML = "Roles:"
    pWeight.innerHTML = `Weight kg: ${item.mass_kg}`
    image.src = item.image
    
    h3.innerHTML = item.name
    div.appendChild(h3)
    div.appendChild(pYear)
    div.appendChild(pHomePort)
    div.appendChild(pType)
    div.appendChild(pWeight)

    div.appendChild(pRoles)
    div.appendChild(divRole);

    div.appendChild(image)
    displayDiv.append(div)
  }
}

// Search Button Click
let searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchInput = document.querySelector("#search");

  makeRequest(searchInput.value);
});
