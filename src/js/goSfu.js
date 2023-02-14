const updateInterval = 5000;

function highlightClassSearchInstructorNames(node) {
    const instructorNames = node.querySelectorAll(`[id^=win0divMTG_INSTR] > span`);

    instructorNames.forEach(element => {
        element.style.fontWeight = "bold";
        element.style.color = "blue";
    });
}

function hoverTooltipOverInstructorNames(node) {
    const instructorNames = node.querySelectorAll(`[id^=win0divMTG_INSTR] > span`);

    instructorNames.forEach(element => {
        let instructorSpan = node.createElement("span");
        instructorSpan.className = "instructor";
        instructorSpan.innerText = element.innerText; // goSfu rejects innerHtml currently. Avoid using it.

        let boxSpan = node.createElement("span");
        boxSpan.className = "box";
        boxSpan.innerText = "RMP Data";

        if(!element.querySelector("span.instructor")){
            element.innerText = '';
            element.appendChild(instructorSpan);
        }

        if(!instructorSpan.querySelector("span.box"))
        {instructorSpan.appendChild(boxSpan);}
    });
    
}

function renderProfessorRatings() {
    console.log("rendering RMP rating on goSFU...");

    const iframe = document.getElementById('ptifrmtgtframe').contentWindow.document;
    highlightClassSearchInstructorNames(iframe);
    hoverTooltipOverInstructorNames(iframe);
}

function render() {
    renderProfessorRatings();
    setInterval(renderProfessorRatings, updateInterval);
}

export default {
    render
}