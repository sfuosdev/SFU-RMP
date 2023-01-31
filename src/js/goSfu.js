const updateInterval = 5000;

function highlightClassSearchInstructorNames(node) {
    const instructorNames = node.querySelectorAll(`[id^=win0divMTG_INSTR] > span`);
    instructorNames.forEach(element => {
        element.style.fontWeight = "bold";
        element.style.color = "blue";
    });
}

function renderProfessorRatings() {
    console.log("rendering RMP rating on goSFU...");

    const iframe = document.getElementById('ptifrmtgtframe').contentWindow.document;
    highlightClassSearchInstructorNames(iframe);
}

function render() {
    renderProfessorRatings();
    setInterval(renderProfessorRatings, updateInterval);
}

export default {
    render
}
