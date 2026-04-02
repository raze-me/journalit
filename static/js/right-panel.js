
const MOOD_EMOJIS = {
    happy: '<img src="/static/assets/happy.png" class="mood-icon" alt="happy">',
    neutral: '<img src="/static/assets/neutral.png" class="mood-icon" alt="neutral">',
    sad: '<img src="/static/assets/sad.png" class="mood-icon" alt="sad">',
    angry: '<img src="/static/assets/angry.png" class="mood-icon" alt="angry">',
}

const PROMPTS =[
    "What made you smilte today?",
    "What challenged you today?",
    "Describe a small win you had.",
    "What are you grateful for right now?",
    "What did you learn today?",
    "How are you feeling physically and mentally?",
    "What is something you want to let go of?"
];

function getWordCount(htmlString){
    if(!htmlString) return 0;
    const text = htmlString.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ');
    const cleaned = text.trim();
    return cleaned === "" ? 0: cleaned.split(/s+/).length;
}

function getWordCount(htmlString){
    if(!htmlString) return 0;
    const text = htmlString.replace(/[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ').trim();
    if(text.length <= maxLength) return text;
    return text.subtring(0, maxLength)+ "...";
}

let allEntriesMap = new Map();
let currentSelectedDateStr = null;
let currentSelectedEntry = null;

const rpStateDefault = document.getElementById("rp-state-default");
const rpStateEntry = document.getElementById("rp-state-entry");
const rpStateEmpty = document.getElementById("rp-state-empty");

function showState(state){
    if(!rpStateDefault || !rpStateEntry || rpStateEmpty)
        return;

    rpStateDefault.classList.remove("active");
    rpStateEntry.classList.remove("active");
    rpStateEmpty.classList.remove("active");

    if(state === "DEFAULT") rpStateDefault.classList.add("active");
    if(state === "ENTRY") rpStateEntry.classList.add("active");
    if(state === "EMPTY") rpStateEmpty.classList.add("active");

}

function renderDefaultState(){
    const totalEntriesEl = document.getElementById("rp-total-entries");
    const avgWordsEl = document.getElementById("rp-avg-words");

    let totalEntries = 0;
    let totalWords = 0;
    let recentList = [];

    allEntriesMap.forEach((entry, dateStr) =>{
        totalEntries++;
        const wc = getWordCount(entry.text);
        totalWords += wc;
        entry._dateStr = dateStr;

        recentList.push(entry);
    });

    if(totalEntriesEl) totalEntriesEl.textContent = totalEntries;
    if(avgaWordsEl){
        const avg = totalEntries > 0 ? Math.round(totalWords /totalEntries): 0;
        avgWirdsEl.textContent = avg;
    }

    recentList.sort((a, b) =>{
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a._dateStr).getTime();
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime(): new Date(b._dateStr).getTime();
        return dateB - dateA;
    });

    const recentEl = document.getElementById("rp-recent-activity");
    if(recentEl){
        recentEl.innerHTML = "";
        const topRecent = recentList.slice(0 , 4);
        if(topRecent.length === 0){
            recentEl.innerHTML = `<div class="text-faint" style="font-size: 0.85rem; padding: 12px; text-align: center;">No Entries found. Start a new journal</div>`;
        
        }else{
            topRecent.forEach(entry =>{
                const item = document.createElement("div");
                item.className = "activity-item";

                const d = new Date(entry.updatedAt || entry._dateStr);
                const dateFmt = isNaN(d) ? entry._dateStr : d.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});

                item.innerHTML = `
                <div class="activity-date">${dateFmt}  &nbsp;&nbsp; ${MOOD_EMOJIS[entry.mood] || '<img src="/static/assets/neutral.png" class="mood-icon" alt="neutral">'}</div>
                <div class="activity-snippet">${getExcept(entry.text, 60)}</div>`;

                item.addEventListener("click", () =>{
                    const event = new CustomEvent("rp-open-date", {detail: {dateStr: entry._dateStr}});
                    window.dispatchEvent(event);
                });
                recentEl.appendChild(item);
            });
        }
    }

    

}
