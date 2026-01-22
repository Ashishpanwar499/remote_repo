const api = "https://api.github.com/users/";

// Fix 1: Properly inject Axios script (corrected template literal and quotes)
const axiosScript = document.createElement("script");
axiosScript.src = "https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js";
axiosScript.crossOrigin = "anonymous";
document.head.appendChild(axiosScript);

const main = document.getElementById("main");
const inputForm = document.getElementById("userInput");
const inputBox = document.getElementById("inputBox");

// Fix 2: Wait for Axios to load before making calls
const userGetFunction = (name) => {
    axios.get(api + name)
        .then((response) => {
            userCard(response.data);
            repoGetFunction(name);
        })
        .catch((err) => {
            if (err.response && err.response.status === 404) {
                errorFunction("No profile with this username");
            } else {
                errorFunction("An error occurred");
            }
        });
};

const repoGetFunction = (name) => {
    axios.get(`${api}${name}/repos?sort=created`)
        .then((response) => {
            repoCardFunction(response.data);
        })
        .catch(() => {
            errorFunction("Problem fetching repos");
        });
};

const userCard = (user) => {
    const id = user.name || user.login;
    const info = user.bio ? `<p>${user.bio}</p>` : "";
    const cardElement = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${id}</h2>
                ${info}
                <ul>
                    <li>${user.followers} <strong>Followers</strong></li>
                    <li>${user.following} <strong>Following</strong></li>
                    <li>${user.public_repos} <strong>Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>`;
    // Fix 3: Close the template literal and assign to innerHTML
    main.innerHTML = cardElement;
};

const errorFunction = (error) => {
    main.innerHTML = `
        <div class="card">
            <h1>${error}</h1>
        </div>`;
};

const repoCardFunction = (repos) => {
    const reposElement = document.getElementById("repos");
    // Clear previous repos before appending new ones
    reposElement.innerHTML = ""; 
    repos.slice(0, 5).forEach(repo => {
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;
        reposElement.appendChild(repoEl);
    });
};

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = inputBox.value.trim();
    if (user) {
        userGetFunction(user);
        inputBox.value = "";
    }
});
