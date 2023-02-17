import Course from "./models/Course.js";
import RmpSearchResultCollection from "./models/RmpSearchResultCollection.js";

//const AVAILABLE_PROGRAMS_URL = "https://www.sfu.ca/students/calendar/courses.html";
const SFU_ACADEMIC_CALANDER = "https://www.sfu.ca/students/calendar/2023/spring/courses.html";
const RMP_SEARCH_BASE_URL = "https://www.ratemyprofessors.com/search/teachers";
const RMP_SFU_SID = "U2Nob29sLTE0ODI=";
const SFU_SITE = "https://www.sfu.ca";

const config = {
    headers: {
        "User-Agent": "SFU_RMP"
    }
}

/**
 * Return all available course sessions for the current semester
 * @return Course[]
 */
export const getAllCourses = async () => {

    //returns all available course urls for the current semester
    const jsdom = require("jsdom");
    const calanderHtml = await fetch(SFU_ACADEMIC_CALANDER, config).then(res => res.text());
    const doc = new jsdom.JSDOM(calanderHtml).window.document;
    const list = doc.querySelectorAll(".course-finder > ul > li > a");
    const hrefs = Array.from(list).map(a => SFU_SITE + a.href);

    //Based on the course urls, using promise All to fetch all course details
    const responses = await Promise.all(hrefs.map(href => fetch(href, config)
                    .then(res => {
                        const dom = new jsdom.JSDOM(res);
                        const selectElement = dom.window.document.querySelector('.sub-menu');
                        const courseDetailurl = Array.from(selectElement.options)
                            .map(option => SFU_SITE + option.getAttribute('data-href'))
                            .filter(href => href !== null);
                        return courseDetailurl;
                    })
                    .catch(error => console.error(error))));
    
    responses.forEach(url => fetch(url, config)
                        .then(res => res.text()
                        .then(html => new Course(html))));
}

/**
 * Return Professor ratings for a given professor name
 * @return RmpSearchResultCollection
 */
export const getRmpSearchResultCollection = async (professorName) => {

    const query = "query=" + professorName;
    const sid = "sid=" + RMP_SFU_SID; 
    const url = encodeURI(RMP_SEARCH_BASE_URL + "?" + query + "&" + sid);

    const html = await fetch(url, config).then(res => res.text());

    const rmpSearchResultCollection = new RmpSearchResultCollection(html);

    return rmpSearchResultCollection;
}

export default {
    getRmpSearchResultCollection
}