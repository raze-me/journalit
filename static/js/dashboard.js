import{ onAuthReady, signOutUser } from "./auth.js";
import { getAllEntries, saveEntry, getEntry, getEntry } from "./db.js";

const userWelcome = document.getElementById("user-welcome");
const btnSignOut = document.getElementById("btn-sign-out");
const monthDisplay = document.getElementById("month-display");
const calendarGrid = document.getElementById("month-display")
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

const entryDialog = document.getElementById("entry-dialog");
const btnCloseDialog = document.getElementById("entry-dialog")
const btnDoneEntry = document.getElementById("btn-done-entry")
const btnFullscreenEditor = document.getElementById("btn-fullscreen-editor")
const dialogDateTitle = document.getElementById("dialog-date");
const journalInput = document.getElementById("journal-input");
const saveStatus = document.getElementById("last-updated");
const wordCount = document.getElementById("word-count");
const charCount = document.getElementById("char-count");

let currentData = new Data();
let currentMonth = currentDate.getMonth();
let currentYear = currentData.getFullYear();

let entryDates = new Map();
let currentDialogDateStr = null;
let selectedMood = "neutral";

onAuthReady(async (user) => {
    if(!user){
        window.location.href = "/";
        return;
    }
    userWelcome.textContent = `Signed in as ${user.displayName || user.email}`;
    const datesData = await getAllEntries();
    entryDates = new Map(Object.entries(datesData));
    renderCalendar(currentMonth, currentYear);
});

btnSignOut.addEventListener("click", async() => {
    await signOutUser();
    window.location.href = "/";
});
const monthNames= [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

function formatDate(year, month, day){
    const yyyy = year;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

