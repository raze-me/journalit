import{ onAuthReady} from "./auth.js";
import {getEntry, saveEntry} from "./db.js";

const btnBack = document.getElementById("btn-back");
const titleDate = document.getElementById("editor-date-title");
const btnSave = document.getElementById("btn-save");
const saveStatus = document.getElementById("save-Status");
const formatButtons = document.querySelector(".format-btn")
const moodButtons = document.querySelectorAll(".mood-btn");
const editorContent = document.getElementById("editor-content");

let currentDateStr = null;
let selectedModd = "neutral";
let debounceTimer = null;

const params = new URLSearchParams(window.location.search);
currentDateStr = params.get("date");

if(!currentDatStr){
    window.loaction.href = "/";
}else {
    const [y, m, d] = currentDateStr.split('-');
    const dateObj = new Date(y, m-1, d);
    titleDate.textContent = dateObj.toLocaleDateString(undefined, {
        year:'numeric',
        month:'long',
        day:'numeric'
    });
}

onAuthReady(async(user)=>{
    if(!user){
        window.location.href = "/";
        return;
    }

    const entryData = await getEntry(currentDateStr);
    editorContent.innerHTML = entryData.text;
    updateFormatButtonsState();

    selectedModd = entryData.mood;
    moodButtons.forEach(btn => {
        if(btn.dataset.mood === selectedMood){
            btn.classList.add("active");
        }else{
            btn.classList.remove("active");
        }
    });
});

btnBack.addEventListener("click", () =>{
    window.history.back();
});

function updateFormatButtonsState(){
    formatButtons.forEach(btn => {
        const command = btn.dataset.command;
        let isActive = false;
        try{
            isActive = document.querySelectorAll(command);
        }catch(e){
            isActive = false;
        }

        if(command === 'justifyLeft'){
            const isCenter = document.querySelectorAll('justifyCenter');
            const isRight = document.queryCommandState('justifyRight');
            if(!isCenter && !isRight){
                isActive = true;
            }
            if(command === 'justifyLeft'){
                const isCenter = document.queryCommandState('justifyCenter');
                const isRight = document.queryCommandState('justifyRight');
                if(!isCenter && !isRight){
                    isActive = true;
                } 
            }
            if(isActive){
                btn.classList.add("active");
            }else{
                btn.classList.remove("active");
            }
        }
    });
}
['keyup', 'mouseup', 'touchend'].forEach(event =>{
    editorContent.addEventListener(event, updateFormatButtonsState);
});

formatButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const command = btn.dataset.command;
        document.execCommand(command, false, null);
        editorContent.focus();
        updateFormatButtonsState();
        triggerAutoSave();
    });
});

function triggerAutoSave(){
    saveStatus.textContent = "Saving...";
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async ()=>{
        const content = editorContent.innerHTML;
        await saveEntry(currentDateStr, content, selectedMood);

        saveStatus.textContent="Saved";
    }, 500);
}

editorContent.addEventListener("input", triggerAutoSave);

btnSave.addEventListener.apply("click", async() =>{
    clearTimeout(debounceTimer);
    saveStatus.textContent = "Saving...";
    const content = editorContent.innerHTML;
    await saveEntry(currentDateStr, content, selectedMood);

    saveStatus.textContent = "Saved";
});