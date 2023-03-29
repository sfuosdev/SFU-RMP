import { findProfessorRatingsByCourseSection } from "../web/rateMyProfessor.js";
import { colorInstructorName, containsRmpWrapper, createTooltip, drawProfessorRatingsInTooltip } from "./commonElements.js";

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
            const tooltip = createTooltip();
    
            const className = rowWrapper.querySelector(`[id^=P_CLASS_NAME]`).querySelector("a").innerHTML.split("<br>")[0];
            const programName = className.split(" ")[0];
            const courseNumber = className.split(" ")[1].split("-")[0];
            const sectionName = className.split(" ")[1].split("-")[1];
            
            const professorRatings = await findProfessorRatingsByCourseSection(programName, courseNumber, sectionName);
            if (professorRatings.length > 0) {
                drawProfessorRatingsInTooltip(tooltip, professorRatings);
                instructorNameElement.appendChild(tooltip);
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
            const tooltip = createTooltip();

            const className = rowWrapper.querySelector(`[id^=E_CLASS_NAME]`).querySelector("a").innerHTML.split("<br>")[0];
            const programName = className.split(" ")[0];
            const courseNumber = className.split(" ")[1].split("-")[0];
            const sectionCode = className.split(" ")[1].split("-")[1];
            
            const professorRatings = await findProfessorRatingsByCourseSection(programName, courseNumber, sectionCode);
            if (professorRatings.length > 0) {
                drawProfessorRatingsInTooltip(tooltip, professorRatings);
                instructorNameElement.appendChild(tooltip);
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
        let upperRowSectionCode;
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
            const tooltip = createTooltip();
            const sectionTd = rowWrapper.querySelector(`[id^=MTG_CLASSNAME]`);

            let professorRatings;
            if(!sectionTd && upperRowSectionCode)
                professorRatings = await findProfessorRatingsByCourseSection(programName, courseNumber, upperRowSectionCode);
            else {
                const sectionCode = sectionTd.querySelector("a").innerHTML.split("<br>")[0].split("-")[0];
                upperRowSectionCode = sectionCode;
                professorRatings = await findProfessorRatingsByCourseSection(programName, courseNumber, sectionCode);
            }

            if (professorRatings.length > 0) {
                drawProfessorRatingsInTooltip(tooltip, professorRatings);
                instructorNameElement.appendChild(tooltip);
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