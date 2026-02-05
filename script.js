// =====================
// LOAD DATA
// =====================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let studyTime = Number(localStorage.getItem("studyTime")) || 0;

let studyChart;
let taskChart;

// =====================
// LOAD THEME
// =====================
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    document.querySelector(".theme-toggle").textContent = "☀️ Light Mode";
}

// =====================
// INITIAL UPDATE
// =====================
updateTasks();
updateStudyTime();
updateInsight();
updateCharts();

// =====================
// THEME TOGGLE
// =====================
function toggleTheme() {
    document.body.classList.toggle("dark");

    let isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    document.querySelector(".theme-toggle").textContent =
        isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// =====================
// TASK FUNCTIONS
// =====================
function addTask() {
    let input = document.getElementById("taskInput");
    if (input.value === "") return;

    tasks.push({ text: input.value, done: false });
    input.value = "";

    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTasks();
    updateInsight();
    updateCharts();
}

function updateTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.textContent = task.text;
        if (task.done) li.style.textDecoration = "line-through";

        li.onclick = () => {
            tasks[index].done = !tasks[index].done;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            updateTasks();
            updateInsight();
            updateCharts();
        };

        list.appendChild(li);
    });
}

// =====================
// STUDY TIME
// =====================
function addStudyTime() {
    let input = document.getElementById("studyInput");
    if (input.value === "") return;

    studyTime += Number(input.value);
    input.value = "";

    localStorage.setItem("studyTime", studyTime);
    updateStudyTime();
    updateInsight();
    updateCharts();
}

function updateStudyTime() {
    document.getElementById("totalTime").textContent =
        `Total Study Time: ${studyTime} hrs`;
}

// =====================
// SMART INSIGHT
// =====================
function updateInsight() {
    let completed = tasks.filter(t => t.done).length;
    let insight = document.getElementById("insight");

    if (tasks.length === 0 && studyTime === 0) {
        insight.textContent = "Start by adding tasks and study hours 📌";
    } else if (studyTime < 2) {
        insight.textContent = "Low study time ⏳ Aim for 2+ hours today.";
    } else if (completed < tasks.length / 2) {
        insight.textContent = "Good effort, complete more tasks 🎯";
    } else {
        insight.textContent = "Excellent productivity! 🚀";
    }
}

// =====================
// CHARTS
// =====================
function updateCharts() {

    if (studyChart) studyChart.destroy();
    studyChart = new Chart(
        document.getElementById("studyChart"),
        {
            type: "bar",
            data: {
                labels: ["Study Time"],
                datasets: [{
                    label: "Hours",
                    data: [studyTime],
                    backgroundColor: "#007bff"
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        }
    );

    if (taskChart) taskChart.destroy();
    let completed = tasks.filter(t => t.done).length;
    let pending = tasks.length - completed;

    taskChart = new Chart(
        document.getElementById("taskChart"),
        {
            type: "pie",
            data: {
                labels: ["Completed", "Pending"],
                datasets: [{
                    data: [completed, pending],
                    backgroundColor: ["#28a745", "#dc3545"]
                }]
            }
        }
    );
}

// =====================
// RESET DASHBOARD DATA
// =====================
function resetDashboard() {

    if (!confirm("Are you sure you want to clear all dashboard data?")) {
        return;
    }

    // Clear only project-related data
    localStorage.removeItem("tasks");
    localStorage.removeItem("studyTime");

    // Reset variables
    tasks = [];
    studyTime = 0;

    // Update UI
    updateTasks();
    updateStudyTime();
    updateInsight();
    updateCharts();
}

// ===================== END OF FILE =====================