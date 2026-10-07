/* =========================================================
   OPENRESCUE JAVASCRIPT
========================================================= */


/* =========================================================
   DISASTER DATA
========================================================= */
const API_BASE_URL = "http://127.0.0.1:8000/api";
const disasterData = {

    flood: {

        title: "Flood situation detected",

        severity: 78,

        priority: "HIGH PRIORITY",

        description:
            "Multiple reports indicate rising water levels and possible route blockage.",

        tags: [
            "Flood",
            "Route blockage",
            "People at risk"
        ]

    },

    earthquake: {

        title: "Earthquake situation detected",

        severity: 91,

        priority: "CRITICAL PRIORITY",

        description:
            "Reports indicate structural damage and possible trapped or displaced people.",

        tags: [
            "Earthquake",
            "Structural risk",
            "People at risk"
        ]

    },

    fire: {

        title: "Fire incident detected",

        severity: 86,

        priority: "HIGH PRIORITY",

        description:
            "Incident reports suggest active fire risk with potential danger to nearby areas.",

        tags: [
            "Fire",
            "Smoke risk",
            "Evacuation"
        ]

    },

    landslide: {

        title: "Landslide situation detected",

        severity: 73,

        priority: "HIGH PRIORITY",

        description:
            "Ground movement may have blocked routes and created additional safety risks.",

        tags: [
            "Landslide",
            "Blocked route",
            "Ground instability"
        ]

    }

};


/* =========================================================
   SEARCH DISASTER
========================================================= */

function searchDisaster() {

    const input =
        document.getElementById("disasterSearch");

    const query =
        input.value.trim().toLowerCase();

    if (!query) {

        showToast(
            "Search a situation",
            "Try flood, earthquake, fire or landslide."
        );

        return;
    }


    let type = null;


    if (query.includes("flood")) {

        type = "flood";

    } else if (query.includes("earthquake")) {

        type = "earthquake";

    } else if (query.includes("fire")) {

        type = "fire";

    } else if (
        query.includes("landslide") ||
        query.includes("land slide")
    ) {

        type = "landslide";

    }


    if (!type) {

        showToast(
            "Topic not recognized",
            "Try Flood, Earthquake, Fire or Landslide."
        );

        return;
    }


    updateAnalysis(type);

}


/* =========================================================
   QUICK TOPIC
========================================================= */

function setTopic(topic) {

    document.getElementById("disasterSearch").value =
        topic;

    updateAnalysis(topic.toLowerCase());

}


/* =========================================================
   UPDATE AI ANALYSIS
========================================================= */

function updateAnalysis(type) {

    const data =
        disasterData[type];

    if (!data) return;


    document.getElementById("analysisTitle")
        .textContent = data.title;


    document.getElementById("severityNumber")
        .textContent = data.severity;


    document.getElementById("severityText")
        .textContent = data.priority;


    document.getElementById("severityDescription")
        .textContent = data.description;


    const tags =
        document.querySelector(".ai-tags");


    tags.innerHTML = "";


    data.tags.forEach(tag => {

        const span =
            document.createElement("span");

        span.textContent = tag;

        tags.appendChild(span);

    });


    showToast(
        "AI Analysis Complete",
        `${capitalize(type)} incident prioritized at ${data.severity}/100.`
    );

}


/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}


/* =========================================================
   REPORT MODAL
========================================================= */

function openReport() {

    document
        .getElementById("reportModal")
        .classList.add("show");

}


function closeReport() {

    document
        .getElementById("reportModal")
        .classList.remove("show");

}


/* =========================================================
   SUBMIT REPORT
========================================================= */

async function submitReport() {

    const disasterType =
        document.getElementById("reportType").value;

    const description =
        document.getElementById("reportDescription").value;

    const location =
        document.getElementById("reportLocation").value;


    // Check required fields
    if (!disasterType) {
        alert("Please select a disaster type.");
        return;
    }

    if (!description.trim()) {
        alert("Please describe the emergency.");
        return;
    }

    if (!location.trim()) {
        alert("Please enter the location.");
        return;
    }


    // Data sent to FastAPI backend
    const reportData = {

        disaster_type: disasterType,

        description: description,

        location: location,

        latitude: null,

        longitude: null,

        people_affected: 1
    };


    try {

        // Send report to OpenRescue backend
        const response = await fetch(
            `${API_BASE_URL}/reports`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(reportData)
            }
        );


        if (!response.ok) {
            throw new Error("Failed to submit report");
        }


        // Get backend response
        const result = await response.json();

        console.log("OpenRescue Response:", result);

        console.log(
            "AI Analysis:",
            result.ai_analysis
        );


        // Close emergency report modal
        const modal =
            document.getElementById("reportModal");

        if (modal) {
            modal.classList.remove("active");
        }


        // Show success message
        alert(
            `Emergency reported successfully!\n\n` +
            `Incident ID: ${result.incident_id}\n` +
            `AI Priority: ${result.ai_analysis.priority_label}\n` +
            `Severity: ${result.ai_analysis.severity_label}`
        );


        // Clear form
        document.getElementById(
            "reportDescription"
        ).value = "";

        document.getElementById(
            "reportLocation"
        ).value = "";


        // Refresh dashboard if these functions exist
        if (typeof loadIncidents === "function") {
            loadIncidents();
        }

        if (typeof loadStatistics === "function") {
            loadStatistics();
        }


    } catch (error) {

        console.error(
            "OpenRescue backend error:",
            error
        );

        alert(
            "Could not connect to OpenRescue backend.\n\n" +
            "Please make sure FastAPI is running."
        );
    }
}

function showIncident(
    location,
    severity,
    details
) {

    showToast(
        location,
        `${severity} priority • ${details}`
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(title, message) {

    const toast =
        document.getElementById("toast");


    document.getElementById("toastTitle")
        .textContent = title;


    document.getElementById("toastMessage")
        .textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);

}


/* =========================================================
   MAP SCROLL
========================================================= */

function scrollToMap() {

    document
        .getElementById("map-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

document
    .getElementById("reportModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeReport();

        }

    });


/* =========================================================
   ENTER KEY SEARCH
========================================================= */

document
    .getElementById("disasterSearch")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            searchDisaster();

        }

    });


/* =========================================================
   LIVE PEOPLE COUNTER
========================================================= */

let people = 126;


setInterval(() => {

    const change =
        Math.floor(Math.random() * 3) - 1;

    people += change;

    if (people < 110) {
        people = 110;
    }

    document
        .getElementById("peopleCount")
        .textContent = people;

}, 5000);