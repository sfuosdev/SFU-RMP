import Course from "../models/Course.js";
import Section from "../models/Section.js";
import ProfessorRating from "../models/ProfessorRating.js";
import { validateCourseDetailHTML } from "./validator.js";
import { createDOM } from "../web/utils.js";

/**
 * @returns {Course}
 * @param {String} html SFU course detail page  
 */
export const parseHtmlToCourse = (html) => {
    validateCourseDetailHTML(html);
    const doc = createDOM(html);
    const courseWrapper = doc.querySelector("section.main");
    const courseInfo = courseWrapper.querySelector("small.course_number").innerHTML.replace(/(\r\n|\n|\r)/gm, "").split("\t").filter(str => str != '');
    const program = courseInfo[0];
    const courseNumber = courseInfo[1];

    const sections = [];
    const sectionWrappers = courseWrapper.querySelectorAll("tr.main-section");
    sectionWrappers.forEach(wrapper => {
        const boxes = wrapper.querySelectorAll("td");
        const section = boxes[0].querySelector("a").innerHTML.trim();
        const professors = boxes[1].innerHTML.split("<br>").map(txt => txt.replace(/(\r\n|\n|\r|\t)/gm,"")).filter(txt => txt !== '');
        sections.push(new Section(section, professors));
    });

    return new Course(program, courseNumber, sections);
}

/**
 * @returns {ProfessorRating[]}
 * @param {String} html RMP search result by professor page. It could contain multiple professor ratings found on the search
 */
export const parseHtmlToProfessorRatings = (html) => {
    const dom = createDOM(html);
    const scriptTags = dom.querySelectorAll("body > script");
    let professorInfos = [];
    scriptTags.forEach(tag => {
        if (tag.innerHTML.includes("window.__RELAY_STORE__")) {
            const data = JSON.parse(tag.innerHTML.match(`{(.*)}`)[0]);
            professorInfos = Object.values(data).filter(val => val.__typename == "Teacher");
        }
    });

    const professorRatings = [];
    professorInfos.forEach(info => {
        const name = info.firstName + ' ' + info.lastName;
        const department = info.department;
        const numOfRatings = info.numRatings;
        const quality = info.avgRating;
        const wouldLikeToTakeAgainRatio = info.wouldTakeAgainPercent > 0 ? Math.round(info.wouldTakeAgainPercent) / 100 : null;
        const difficulty = info.avgDifficulty;

        professorRatings.push(new ProfessorRating(name, department, numOfRatings, quality, difficulty, wouldLikeToTakeAgainRatio));
    });

    return professorRatings;
}

/**
* Return an array of sub-urls to SFU programs on given Academic Calendar HTML
* e.g. ["/students/calendar/2023/spring/courses/acma.html", "/students/calendar/2023/spring/courses/cmpt.html", ...]
* @param {String} html Academic Calander raw HTML text 
* @returns {String}[]
*/
export const parseHtmlToProgramUrls = (html) => {
    const doc = createDOM(html);
    const programUrls = [];
    const list = doc.querySelectorAll(".course-finder > ul > li > a");
    list.forEach(a => programUrls.push(a.href));
    const uniqueUrls = [...new Set(programUrls)];
    return uniqueUrls;
}

/**
* Return an array of sub-urls to SFU course detail page on given Academic Calendar HTML
* e.g. ["/students/calendar/2023/spring/courses/acma.html", "/students/calendar/2023/spring/courses/cmpt.html", ...]
* @param {String} html Academic Calander raw HTML text 
* @returns {String}[]
*/
export const parseHtmlToCourseUrls = (html) => {
    const doc = createDOM(html);
    const courseUrls = [];
    const list = doc.querySelectorAll("section.main > h3 > a");
    list.forEach(a => courseUrls.push(a.href));
    const uniqueUrls = [...new Set(courseUrls)];
    return uniqueUrls;
}