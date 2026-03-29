import { onAuthReady, signOutUser } from "./auth.js";
import { getAllEntries, saveEntry, getEntry } from "./db.js";

const userWelcome = document.getElementById("user-welcome");
const btnSignOut = document.getElementById("btn-sign-out");
const monthDisplay = document.getElementById("month-display");
const calendarGrid = document.getElementById("calendar-grid");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

const entryDialog = document.getElementById("entry-dialog");
const btnCloseDialog = document.getElementById("btn-close-dialog");
const btnDoneEntry = document.getElementById("btn-done-entry");
const btnFullscreenEditor = document.getElementById("btn-fullscreen-editor");
const dialogDateTitle = document.getElementById("dialog-date");
const journalInput = document.getElementById("journal-input");
const saveStatus = document.getElementById("save-status");
const lastUpdated = document.getElementById("last-updated");
const wordCount = document.getElementById("word-count");
const charCount = document.getElementById("char-count");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let entryDates = new Map();
let currentDialogDateStr = null;
let selectedMood = "neutral";

onAuthReady(async (user) => {
    if (!user) {
        window.location.href = "/";
        return;
    }
    userWelcome.textContent = `Signed in as ${user.displayName || user.email}`;

    const datesData = await getAllEntries();
    entryDates = new Map(Object.entries(datesData));
    renderCalendar(currentMonth, currentYear);
});

btnSignOut.addEventListener("click", async () => {
    await signOutUser();
    window.location.href = "/";
});

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function formatDate(year, month, day) {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function renderCalendar(month, year) {
    calendarGrid.innerHTML = "";
    monthDisplay.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "date-tablet empty";
        calendarGrid.appendChild(emptyCell);
    }

    const today = new Date();

    for (let i = 1; i <= daysInMonth; i++) {
        const tablet = document.createElement("div");
        tablet.className = "date-tablet";

        const dateStr = formatDate(year, month, i);

        if (entryDates.has(dateStr)) {
            const entryMeta = entryDates.get(dateStr);
            tablet.classList.add("has-entry");
            tablet.classList.add(`mood-${entryMeta.mood}`);

            const moodEmojiMap = { happy: '😊', neutral: '😐', sad: '😔', angry: '😡' };
            const emojiDiv = document.createElement("div");
            emojiDiv.className = "date-mood-indicator";
            emojiDiv.textContent = moodEmojiMap[entryMeta.mood] || '😐';
            tablet.appendChild(emojiDiv);
        }

        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            tablet.classList.add("today");
        }

        const dateNum = document.createElement("span");
        dateNum.className = "date-num";
        dateNum.textContent = i;
        tablet.appendChild(dateNum);

        tablet.addEventListener("click", () => {
            openDialog(year, month, i, dateStr);
        });

        calendarGrid.appendChild(tablet);
    }
}

prevMonthBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

let debounceTimer = null;

function updateCounts(text) {
    const chars = text.length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    wordCount.textContent = `${words} word${words === 1 ? '' : 's'}`;
    charCount.textContent = `${chars} character${chars === 1 ? '' : 's'}`;
}

async function openDialog(year, month, day, dateStr) {
    currentDialogDateStr = dateStr;
    const formattedDate = `${monthNames[month]} ${day}, ${year}`;
    dialogDateTitle.textContent = formattedDate;

    journalInput.value = "Loading...";
    journalInput.disabled = true;
    saveStatus.textContent = "";

    entryDialog.classList.add("open");
    entryDialog.setAttribute("aria-hidden", "false");

    const entryData = await getEntry(dateStr);
    journalInput.value = entryData.text;
    journalInput.disabled = false;

    selectedMood = entryData.mood;
    document.querySelectorAll(".mood-btn").forEach(btn => {
        if (btn.dataset.mood === selectedMood) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    updateCounts(entryData.text);

    if (entryData.updatedAt) {
        lastUpdated.textContent = `Last updated: ${entryData.updatedAt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`;
    } else {
        lastUpdated.textContent = "Last updated: Never";
    }
    setTimeout(() => journalInput.focus(), 300);
}
function closeDialog(){
    entryDialog.classList.remove("open");
    entryDialog.setAttribute("aria-hidden", "true");
}

btnCloseDialog.addEventListener("click", closeDialog);
btnDoneEntry.addEventListener("click", closeDialog);

btnFullScreenEdition.addEventListener("click", ()=>{
    if(currentDialogDateStr){
        window.location.href = `/editor.html?date=${currentDialogDateStr}`;
    }
});


