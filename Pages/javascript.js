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

//get new quote button
function getNewQuote() {
    const quoteImage = document.getElementById('quote-image');
    quoteImage.src = '/images/icons8-reset-after.png'; 

    
    generateQuote();

    // Reset the image after a short delay
    setTimeout(() => {
        quoteImage.src = '/images/icons8-reset-100.png'; 
    }, 200);
}

//night mode button
function toggleNightMode() {
    const body = document.body;
    const nightModeImg = document.getElementById('night-mode-image');
    const nightModeText = document.querySelector('#night-mode-container span'); 

    // Toggle the night mode class on the body
    body.classList.toggle('night-mode');
    document.querySelector('.container').classList.toggle('night-mode');  
    document.querySelectorAll('.check-list, .quote-container, .output-list')
        .forEach(el => el.classList.toggle('night-mode'));  

    if (body.classList.contains('night-mode')) {
        nightModeImg.src = '/images/icons8-sun-100.png';  
        nightModeText.textContent = 'Light Mode'; 
    } else {
        nightModeImg.src = '/images/icons8-night-100.png';  
        nightModeText.textContent = 'Night Mode'; 
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

function downloadTasks() {
    // Retrieve the stored data from localStorage
    const storedData = localStorage.getItem('data');
    if (!storedData) {
        alert('No tasks to download!');
        return;
    }

    // Parse the stored JSON data
    const data = JSON.parse(storedData);
    if (!data.tasks || data.tasks.length === 0) {
        alert('No tasks to download!');
        return;
    }

    // Extract only tasks and their checked status
    const tasksForDownload = data.tasks.map(task => ({
        task: task.task,   
        checked: task.checked  
    }));

    // Convert the filtered data to JSON format and prepare for download
    const blob = new Blob([JSON.stringify(tasksForDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


document.getElementById('download-tasks-button').addEventListener('click', downloadTasks);

function loadTasksFromJSON() {
    const fileInput = document.getElementById('json-file-input');
    const file = fileInput.files[0];
    
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function(e) {
            const tasks = JSON.parse(e.target.result);
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.task;
                const span = document.createElement('span');
                span.innerHTML = '\u00D7';
                span.onclick = removeTask;
                li.appendChild(span);
                if (task.checked) {
                    li.classList.add('checked');
                }
                listContainer.appendChild(li);
                maxTaskValue += 10;
                if (task.checked) {
                    taskDoneValue += 10;
                }
            });
            ChangeWidth();
            saveData();
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file.');
    }
}

