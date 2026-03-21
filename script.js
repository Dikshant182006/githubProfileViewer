const searchContainer = document.querySelector(".search-container");
const input = document.getElementById("input");
const errorhandle = document.querySelector(".errorhandle");
const containers = document.querySelector(".container2");
const avatar = document.querySelector(".avatar");
const repoContainer = document.getElementById("repo-container");

// Dom elements for displaying
const headname = document.querySelector(".headname");
const email = document.querySelector(".email");
const locationText = document.querySelector(".location");
const link = document.querySelector(".link");
const date = document.querySelector(".date");
const repo = document.getElementById("repo");
const follower = document.getElementById("followers")
const following = document.getElementById("following")

searchContainer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = input.value.trim();

  if (username) {
    try {
      // display userdata
      const userData = await getUserData(username);
      displayUserInfo(userData);
      
      // display repodata
      const reposData = await getUserRepos(username);
      displayTopRepos(reposData);
        } catch (error) {
      console.error("User not found");
      displayError(error.message); // display the error in the UI.
    }
  }
  input.value = "";
});

async function getUserData(username) {
  //Data come from the api

  const apiUrl = `https://api.github.com/users/${username}`;
  const res = await fetch(apiUrl);

  if (!res.ok) {
    throw new Error("Could not find the user");
  }

  return await res.json();
}

async function getUserRepos(username){
  
  const gitUrl = `https://api.github.com/users/${username}/repos`
  const response = await fetch(gitUrl);

  if(!response.ok){
    throw new Error("Could not fetch the repos")
  }

  return await response.json();
}

function displayUserInfo(data) {
  //Displays the data in the screen

  const {
    login: username,
    name: fullName,
    location: userLocation,
    blog: website,
    created_at: joinDate,
    public_repos: repositories,
    followers: totalFollow,
    following: totalFollowing,
    avatar_url: avatarUrl,
    html_url: profileUrl,
  } = data;

  const displayName = fullName || username;
  const displayLocation = userLocation || "No location";

  const joined = new Date(joinDate);
  const formattedDate = joined.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC", 
  });

  headname.textContent = displayName;
  email.textContent = `@${username}`;
  locationText.textContent = displayLocation;
  link.textContent = website;
  date.textContent = `Joined: ${formattedDate}`;

  repo.textContent = repositories;
  follower.textContent = totalFollow;
  following.textContent = totalFollowing;

  avatar.innerHTML = "";

  const img = document.createElement("img");
  img.src = avatarUrl
  img.alt = `${username} avatar`;
  img.style.width = "100%";
  img.style.borderRadius = "50%";

  avatar.appendChild(img)
}

function displayTopRepos(repos){
  clearRepos();

  const topRepos = [...repos]
  .sort((a, b) => b.stargazers_count - a.stargazers_count) // decending ⭐
  .slice(0, 4); 

  console.log(topRepos);

  if(topRepos.length === 0){
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No repositories available";
    repoContainer.appendChild(emptyMessage); 
    return;      //When return runs, the rest of the displayTopRepos function does NOT execute.
  }

  topRepos.forEach((repo) => {
    const repoCard = document.createElement("div");
    repoCard.classList.add("repo-card");   

    const repoName = repo.name;
    const repoDescription = repo.description || "No description";
    const repoLanguage = repo.language || "Unknown";
    const repoStars = repo.stargazers_count;
    const repoLink = repo.html_url;

    repoCard.innerHTML = `
    <div class="repo-header">
        <a href="${repoLink}" class="action">${repoName}</a>
        <p>${repoDescription}</p>
    </div>
    <div class="repo-footer">
        <div class="repo-lang">
            <span class="lang-name">${repoLanguage}</span>
        </div>
        <div class="repo-stars">
            <span class="star-icon">★</span>
            <span class="star-count">${repoStars}</span>
        </div>
    </div>`

    repoContainer.appendChild(repoCard);
  });

}

function clearRepos(){
  repoContainer.innerHTML = "";
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorhandle");

  containers.textContent = "";
  containers.style.display = "flex";
  containers.appendChild(errorDisplay);
}