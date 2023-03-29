import { findProfessorRatingsByCourseSection } from "../web/rateMyProfessor.js";
import { colorInstructorName, containsRmpWrapper, createTooltip, drawProfessorRatingsInTooltip } from "./commonElements.js";

async function drawProfessorRatings(){
    const courseWrappers = document.querySelectorAll(".course_box");
    for (let courseWrapper of courseWrappers) {

        const courseTitleElement = courseWrapper.querySelector('.course_title');
        const selectionWrappers = courseWrapper.querySelectorAll('.selection_row');
        for (let selectionWrapper of selectionWrappers) {

            /**
             * Highlight Instructor Name
             */
            const instructorNameElement = selectionWrapper.querySelector('[title="Instructor(s)"]');
            if (containsRmpWrapper(instructorNameElement))
                continue;
            colorInstructorName(instructorNameElement);
    
            /**
             * Create Rating Bubble
             */
            const tooltip = createTooltip();
    
            const sectionElement = selectionWrapper.querySelector('strong.leftnclear');
            const programName = courseTitleElement.innerHTML.split(" ")[0];
            const courseNumber = courseTitleElement.innerHTML.split(" ")[1];
            const sectionName = sectionElement.innerHTML.split(" ")[1];
            
            const professorRatings = await findProfessorRatingsByCourseSection(programName, courseNumber, sectionName);
            if (professorRatings.length > 0) {
                drawProfessorRatingsInTooltip(tooltip, professorRatings);
                instructorNameElement.appendChild(tooltip);
            }
        }
    }
}

export function render() {
    const updateInterval = 3000;
    drawProfessorRatings();
    setInterval(drawProfessorRatings, updateInterval);
}