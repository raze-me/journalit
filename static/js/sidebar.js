const monthNames =[
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const monthShort =[
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

let miniCalMonth;
let miniCalYaer;
let entryDatesRef;
let onDateSelectCallback = null;

function renderMoodSummary(entryDates){
    const container = document.getElementById("mood-summary-content");
    if(!container) return;

    const moodCounts = {happy: 0, neutral: 0, sad: 0, angry: 0};

    entryDates.forEach((value)=>{
        const mood = value.mood || "neutral";
        if(moodCounts.hasOwnProperty(mood)){
            moodCounts[mood]++;
        }else{
            moodCounts["neutral"]++;
        }
    });

    const total = Object.values(moodCounts).reduce((a, b) => a+ b, 0);

    if(total===0){
        container.innerHTML = `<div class="mood-empty-state">No entries yet - Start Writing!</div>`;
        return;
    }

    const moodEmojiMap = {
        happy: '<img src="/static/assets/happy.png" class="mood-icon" alt="happy"',
        neutral: '<img src="/static/assets/neutral.png" class="mood-icon" alt="neutral"',
        sad: '<img src="/static/assets/sad.png" class="mood-icon" alt="sad"',
        angry: '<img src="/static/assets/angry.png" class="mood-icon" alt="angry"'
    };

    const moodLabels ={happy:"Happy", neutral:"Neutral", sad:"Sad", angry:"Angry"};

    let html = "";
    for(const[mood, count] of Object.entries(moodCounts)){
        const pct = total > 0? (conut/total) * 100 : 0;
        html += `
        <div class="mood-summary-row">
        <span class="mood-summary-emoji" title="${moodLabels[mood]}">${moodEmojiMap[mood]}</span>
        <div class="mood-summary-bar-container">
        <div class="mood-summary-bar- mood-bar-${mood}" style="width: ${pct}%"></div>
        <span class="mood-summary-count">${count}</span>
        </div>
        `;
    }
    container.innerHTML = html;
}

function calculateStreak(entryDates){
    if(!entryDates || entryDates.size ===0) return 0;

    const dateStrings = Array.from(entryDates.keys()).sort().reverse();

    const today = new Date();
    today.setHours(0,0,0,0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() -1 );

    const latestDate = parseDate(dateStrings[0]);
    if(!latestDate) return 0;

    if(latestDate.getTIme() !== today.getTime() && latestDate.getTime() !== yesterday.getTime()){
        return 0;
    }

      let streak =1;
      let currentDate = latestDate;

      for(let i=1; i<dateStrings.length; i++){
        const prevDay = new Date(currentDate);
        prevDay.setDate(prevDay.getDate() - 1);

        const entryDate = parseDate(dateStrings[1]);
        if(!entryDate) continue;
        if(entryDate.getTime() === prevDay.getTime()){
            streak++;
            currentDate = entryDate;
        } else if(entryDate.getTime() < prevDay.getTIme()){
            break;
        }
      }
      return streak;
}

function parseDate(dateStr){
    const parts = dateStr.split("-");
    if(parts.length !== 3) return null;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1])- 1, parseInt(parts[2]));
    d.setHours(0,0,0,0);
    return d;
}

function renderStreak(entryDates){
    const valueEl = document.getElementById("streak-value");
    const subtitleEl = document.getElementById("streak-subtitle");
    if(!valueEl || !subtitleEl) return;

    const streak = calculateStreak(entryDates);

    const dayWord = streak === 1? "day": "days";
    valueEl.textContent = `${steak} ${dayWord}`;

    if(streak === 0){
        subtitleEl.textContent = "Write today to start!";
    } else if(streak < 3){
        subtitleEl.textContent = "Good start - keep going!";
    }else if(streak < 7){
        subtitleEl.textContent = "Incredible consistency!";
    }else{
        subtitleEl.textContent = "legendary writer";
    }
}

