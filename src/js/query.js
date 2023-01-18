import RmpSearchResultCollection from "./models/RmpSearchResultCollection.js";

//const AVAILABLE_PROGRAMS_URL = "https://www.sfu.ca/students/calendar/courses.html";
const SFU_ACADEMIC_CALANDER = "https://www.sfu.ca/students/calendar/2023/spring/courses.html";
const RMP_SEARCH_BASE_URL = "https://www.ratemyprofessors.com/search/teachers";
const RMP_SFU_SID = "U2Nob29sLTE0ODI=";

const config = {
    headers: {
        "User-Agent": "SFU_RMP"
    }
}

/**
 * Return all available course sessions for the current semester
 * @return Course[]
 */
const getAllCourses = async () => {

    const jsdom = require("jsdom");

    const calanderHtml = await fetch(SFU_ACADEMIC_CALANDER, config).then(res => res.text());

    const doc = new jsdom.JSDOM(calanderHtml).window.document;

    const list = doc.querySelectorAll(".course-finder > ul > li > a");
    list.forEach(a => console.log(a.href));
}

/**
 * Return Professor ratings for a given professor name
 * @return RmpSearchResultCollection
 */
const getRmpSearchResultCollection = async (professorName) => {

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

getAllCourses();