import { findProfessorRatingsByCourseSection } from "../web/rateMyProfessor.js";
import { colorInstructorName, containsRmpWrapper, createRatingBubbleElement, drawProfessorRatingsInRatingBubble } from "./commonElements.js";

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

async function drawProfessorRatingsOnEnrollTab(tabWindow) {
    const body = tabWindow.querySelector("#SSR_SSENRL_CART");
    if (!body)
        return;

    const courseCart = body.querySelector(`[id^=win0divSSR_REGFORM_VW]`);
    const courseSchedule = body.querySelector(`[id^=win0divDERIVED_REGFRM1_GROUP6]`);

    if (courseCart) {
        const rowWrappers = courseCart.querySelectorAll(`[id^=trSSR_REGFORM_VW]`);
        for (const rowWrapper of rowWrappers) {

            /**
             * Highlight Instructor Name
             */
            const instructorNameElement = rowWrapper.querySelector(`[id^=win0divDERIVED_REGFRM1_SSR_INSTR_LONG]`).querySelector("span");
            if (containsRmpWrapper(instructorNameElement))
                continue;
            colorInstructorName(instructorNameElement);

            /**
             * Create Rating Bubble
             */
            const ratingBubble = createRatingBubbleElement();
    
            const className = rowWrapper.querySelector(`[id^=P_CLASS_NAME]`).querySelector("a").innerHTML.split("<br>")[0];
            const programName = className.split(" ")[0];
            const courseNumber = className.split(" ")[1].split("-")[0];
            const sectionName = className.split(" ")[1].split("-")[1];
            
            const professorRatings = await findProfessorRatingsByCourseSection(programName, courseNumber, sectionName);
            if (professorRatings.length > 0) {
                drawProfessorRatingsInRatingBubble(ratingBubble, professorRatings);
                instructorNameElement.appendChild(ratingBubble);
            }
        }
    }

    if (courseSchedule) {
        const rowWrappers = courseSchedule.querySelectorAll(`[id^=trSTDNT_ENRL_SSVW]`);
        for (const rowWrapper of rowWrappers) {
            
            /**
             * Highlight Instructor Name
            */
            const instructorNameElement = rowWrapper.querySelector(`[id^=win0divDERIVED_REGFRM1_SSR_INSTR_LONG]`);
            if (containsRmpWrapper(instructorNameElement))
                continue;
            colorInstructorName(instructorNameElement);

            /**
             * Create Rating Bubble
             */
            const ratingBubble = createRatingBubbleElement();

            const className = rowWrapper.querySelector(`[id^=E_CLASS_NAME]`).querySelector("a").innerHTML.split("<br>")[0];
            const programName = className.split(" ")[0];
            const courseNumber = className.split(" ")[1].split("-")[0];
            const sectionCode = className.split(" ")[1].split("-")[1];
            
            const professorRatings = await findProfessorRatingsByCourseSection(programName, courseNumber, sectionCode);
            if (professorRatings.length > 0) {
                drawProfessorRatingsInRatingBubble(ratingBubble, professorRatings);
                instructorNameElement.appendChild(ratingBubble);
            }
        }
    }
}

async function drawProfessorRatingOnClassSearchTab(tabWindow) {
    const body = tabWindow.querySelector("#CLASS_SEARCH");
    if (!body)
        return;

    const sectionGroupBoxes = tabWindow.querySelectorAll(`[id^=win0divSSR_CLSRSLT_WRK_GROUPBOX2] > table`);
    for (const sectionGroupBox of sectionGroupBoxes) {

        const courseInfo = sectionGroupBox.querySelector(`[id^=win0divSSR_CLSRSLT_WRK_GROUPBOX2GP]`).textContent.split(" ");
        const programName = courseInfo[0].trim();
        const courseNumber = courseInfo[2];

        const rowWrappers = sectionGroupBox.querySelectorAll(`[id^=trSSR_CLSRCH_MTG1]`);
        for (const rowWrapper of rowWrappers) {
            /**
             * Highlight Instructor Name
            */
            const instructorNameElement = rowWrapper.querySelector(`[id^=MTG_INSTR]`);
            if (containsRmpWrapper(instructorNameElement))
                continue;
            colorInstructorName(instructorNameElement);

            
            /**
             * Create Rating Bubble
             */
            const ratingBubble = createRatingBubbleElement();
            const sectionCode = rowWrapper.querySelector(`[id^=MTG_CLASSNAME]`).querySelector("a").innerHTML.split("<br>")[0].split("-")[0];

            const professorRatings = await findProfessorRatingsByCourseSection(programName, courseNumber, sectionCode);
            if (professorRatings.length > 0) {
                drawProfessorRatingsInRatingBubble(ratingBubble, professorRatings);
                instructorNameElement.appendChild(ratingBubble);
            }
        }
    }
}

function drawProfessorRatings() {
    const iframe = document.querySelector('iframe#ptifrmtgtframe');
    if (iframe) {
        const tabWindow = iframe.contentWindow.document;
        drawProfessorRatingOnClassSearchTab(tabWindow);
        drawProfessorRatingsOnEnrollTab(tabWindow);
    }
}

export function render() {
    const updateInterval = 3000;
    drawProfessorRatings();
    setInterval(drawProfessorRatings, updateInterval);
}