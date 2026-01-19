const entriesDiv = document.getElementById("entries");
const moodSelect = document.getElementById("mood");
const entryText = document.getElementById("entry");
const filterSelect = document.getElementById("filter");
const searchInput = document.getElementById("search");

const happyCountEl = document.getElementById("happyCount");
const sadCountEl = document.getElementById("sadCount");
const angryCountEl = document.getElementById("angryCount");
const calmCountEl = document.getElementById("calmCount");
const trendBar = document.getElementById("trend-bar");

let entries = JSON.parse(localStorage.getItem("entries")) || [];

// Save entry
function saveEntry() {
    const mood = moodSelect.value;
    const text = entryText.value.trim();
    if (!mood || !text) { alert("Select mood and write something!"); return; }

    entries.unshift({ mood, text, time: new Date().toLocaleString() });
    localStorage.setItem("entries", JSON.stringify(entries));

    entryText.value = "";
    moodSelect.value = "";

    renderEntries();
}

// Render entries
function renderEntries() {
    const filter = filterSelect.value.toLowerCase();
    const search = searchInput.value.toLowerCase();
    entriesDiv.innerHTML = "";

    let happy=0, sad=0, angry=0, calm=0;

    const filtered = entries
        .filter(e => filter ? e.mood === filter : true)
        .filter(e => e.text.toLowerCase().includes(search));

    filtered.forEach((entry, index) => {
        if(entry.mood==="happy") happy++;
        if(entry.mood==="sad") sad++;
        if(entry.mood==="angry") angry++;
        if(entry.mood==="calm") calm++;

        const div = document.createElement("div");
        div.classList.add("entry", entry.mood);
        const emojis = {happy:"😊", sad:"😔", angry:"😡", calm:"😌"};
        div.innerHTML = `
            <strong>${emojis[entry.mood]} ${entry.mood.toUpperCase()}</strong><br>
            ${entry.text}<br>
            <small>${entry.time}</small>
            <button class="edit-btn" onclick="editEntry(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
        `;
        entriesDiv.appendChild(div);
    });

    happyCountEl.textContent = happy;
    sadCountEl.textContent = sad;
    angryCountEl.textContent = angry;
    calmCountEl.textContent = calm;

    // Timeline-style mood trend (oldest -> newest)
    trendBar.innerHTML = "";
    entries.slice().reverse().forEach(entry => {
        const dot = document.createElement("div");
        dot.classList.add("trend-dot", entry.mood);
        dot.title = `${entry.mood.toUpperCase()}: ${entry.text} (${entry.time})`;
        trendBar.appendChild(dot);
    });
}

// Delete entry
function deleteEntry(index) {
    if(confirm("Are you sure?")) {
        entries.splice(index,1);
        localStorage.setItem("entries", JSON.stringify(entries));
        renderEntries();
    }
}

// Edit entry
function editEntry(index) {
    moodSelect.value = entries[index].mood;
    entryText.value = entries[index].text;
    deleteEntry(index);
}

// Initial render
renderEntries();
