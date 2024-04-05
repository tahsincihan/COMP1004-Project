document.addEventListener('DOMContentLoaded', function() {
    ShowData(); // Load and display tasks on page load

    // Event listener for the Enter key in the input box
    inputBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTask();
            event.preventDefault();
        }
    });
});

const inputBox = document.getElementById('task-input-box');
const progress = document.querySelector('.progress-done');
let maxTaskValue = 0;
let taskDoneValue = 0;
const listContainer = document.getElementById('list-container');

function addTask() {
    if (inputBox.value.trim() === '') {
        alert('You must write something!');
    } else {
        const li = document.createElement('li');
        li.innerText = inputBox.value.trim();
        const span = document.createElement('span');
        span.innerHTML = '\u00D7';
        span.onclick = removeTask;
        li.appendChild(span);
        listContainer.appendChild(li);
        inputBox.value = ''; // Clear the input box after adding

        maxTaskValue += 10; 
        ChangeWidth();
        saveData(); // Save tasks after adding a new one
    }
}

function removeTask(event) {
    const li = event.target.parentElement;
    if (li.classList.contains('checked')) {
        taskDoneValue -= 10; 
    }
    maxTaskValue -= 10;
    li.remove();
    ChangeWidth();
    saveData(); 
}

listContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');
        if (e.target.classList.contains('checked')) {
            taskDoneValue += 10;
        } else {
            taskDoneValue -= 10;
        }
        ChangeWidth();
        saveData(); 
    }
}, false);


function ChangeWidth() {
    const width = maxTaskValue > 0 ? (taskDoneValue / maxTaskValue) * 100 : 0;
    progress.style.width = width + '%';
    progress.innerText = `${Math.round(width)}%`;
}

function saveData() {
    const tasks = Array.from(listContainer.children).map(li => ({
        task: li.textContent.replace('\u00D7', '').trim(),
        checked: li.classList.contains('checked')
    }));

    const data = {
        tasks,
        maxTaskValue,
        taskDoneValue
    };

    localStorage.setItem('data', JSON.stringify(data));
}

function ShowData() {
    const storedData = localStorage.getItem('data');
    if (storedData) {
        const data = JSON.parse(storedData);
        listContainer.innerHTML = ''; // Clear current tasks

        data.tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.task;
            const span = document.createElement('span');
            span.innerHTML = '\u00D7';
            span.onclick = removeTask;
            li.appendChild(span);
            if (task.checked) {
                li.classList.add('checked');
                taskDoneValue += 10; // Recalculate based on loaded tasks
            } else {
                maxTaskValue += 10; 
            }
            listContainer.appendChild(li);
        });

        maxTaskValue = data.maxTaskValue;
        taskDoneValue = data.taskDoneValue;
        ChangeWidth();
    }


}

const copyBtn = document.querySelector("#copyBtn");
const quoteBox = document.querySelector(".quote");
const authorBox = document.querySelector(".author");


// generating quotes
const generateQuote = async () => {
    const api = "https://api.quotable.io/random";
    quoteBox.textContent = "Loading...";
    authorBox.textContent = "";

    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        quoteBox.innerHTML = data.content;
        authorBox.innerHTML = `- ${data.author}`;
    } catch (error) {
        console.log(error);
        quoteBox.textContent = "Failed to fetch quotes. Please try again later.";
    }
}

// copying quotes
const copyQuote = () => {
    const copiedQuote = quoteBox.innerText;
    const copiedAuthor = authorBox.innerText;

    navigator.clipboard.writeText(`${copiedQuote} ${copiedAuthor}`);
    copyBtn.innerHTML = "&#10003; Copied";
    setTimeout(() => {
        copyBtn.innerHTML = "<i class='fas fa-copy'></i> Copy Quote";
    }, 1000);
}


copyBtn.addEventListener("click", copyQuote);

window.addEventListener("load", generateQuote);

