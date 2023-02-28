const updateInterval = 5000;

function hoverTooltipOverInstructorNames(node) {
    const instructorNames = node.querySelectorAll(`[id^=win0divMTG_INSTR], [id^=win0divDERIVED_REGFRM1_SSR_INSTR_LONG] > span`);

    instructorNames.forEach(element => {
        let instructorSpan = node.createElement("span");
        instructorSpan.className = "instructor";
        instructorSpan.innerText = element.innerText;

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

    const iframeElement = document.querySelector('iframe#ptifrmtgtframe');
    if (iframeElement) {
        const iframe = iframeElement.contentWindow.document;
        hoverTooltipOverInstructorNames(iframe);
    }
}

function render() {
    renderProfessorRatings();
    setInterval(renderProfessorRatings, updateInterval);
}

export default {
    render
}