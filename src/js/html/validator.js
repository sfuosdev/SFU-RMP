import { createDOM } from "../web/utils.js";
import { HtmlValidationError } from "../errors.js";

/**
 * validation functions will throw error if any of required HTML Element is missing
 */

export const validateCourseDetailHTML = (html) => {
    const doc = createDOM(html);
    const courseWrapper = doc.querySelector("section.main");
    if(!courseWrapper)
        throwValidationError("section.main");

    const courseInfo = courseWrapper.querySelector("small.course_number");
    if(!courseInfo || courseInfo.innerHTML.replace(/(\r\n|\n|\r)/gm, "").split("\t").filter(str => str != '').length < 2)
        throwValidationError("small.course_number");
       
    const sections = courseWrapper.querySelectorAll("tr.main-section");
    if(sections.length) {
        sections.forEach(section => {
            if (section.querySelectorAll("td") < 4)
                throwValidationError("tr.main-section");
        });
    }
}

export const validateRMPSearchResultHTML = (html) => {
    const doc = createDOM(html);
    const searchResultWrapper = doc.querySelectorAll(`[class^=TeacherCard__InfoRatingWrapper]`);
    if (!searchResultWrapper.length)
        throwValidationError("[class^=TeacherCard__InfoRatingWrapper]");

    searchResultWrapper.forEach(wrapper => {
        [
            wrapper.querySelector(`[class^=CardName__StyledCardName]`),
            wrapper.querySelector(`[class^=CardSchool__Department]`),
            wrapper.querySelector(`[class^=CardNumRating__CardNumRatingCount]`),
            wrapper.querySelector(`[class^=CardNumRating__CardNumRatingNumber]`)
        ].forEach(wrapper => {
            if (!wrapper)
                throwValidationError("[class^=Card]");
        })

        if(!wrapper.querySelectorAll(`[class^=CardFeedback__CardFeedbackNumber]`))
            throwValidationError("[class^=CardFeedback__CardFeedbackNumber]");
    });
}

const throwValidationError = (missingElementName) => {
    throw new HtmlValidationError(`Required element not found: ${missingElementName}`);
}