import { JSDOM } from "jsdom";
import { URL } from "url";
import RmpSearchResultCollection from "./models/RmpSearchResultCollection.js";
import Course from "./models/Course";
import { createDOM, fetchWithRetries, promiseWindow, PROMISE_WINDOW_SIZE } from "./utils";

const SFU_BASE_URL = "https://www.sfu.ca";
const SFU_ACADEMIC_CALENDER_URL = "https://www.sfu.ca/students/calendar/2023/spring/courses.html";
const RMP_SEARCH_BASE_URL = "https://www.ratemyprofessors.com/search/teachers";
const RMP_SFU_SID = "U2Nob29sLTE0ODI=";

const createRequestHeader = (config) => {
    return {
        headers: {
            "User-Agent": "SFU_RMP"
        },
        ...config
    }
}
    
const isValidUrl = (string) => {
    try {
        const url = new URL(string);
    } catch (err) {
        throw new Error(`Invalid url given: ${string}`);
    }
}

const downloadHTMLFromURL = async (url) => {
    const html = await fetchWithRetries(url, createRequestHeader()).then(res => res.text());
    return html;
}

/**
* Return an array of all sub-urls of programs in Academic Calander
* e.g. ["/students/calendar/2023/spring/courses/acma.html", "/students/calendar/2023/spring/courses/cmpt.html", ...]
* @param {String} html Academic Calander raw HTML text 
* @returns {String}[]
*/
const collectProgramURLsFromCalenderHTML = async (html) => {
    const doc = createDOM(html);
    const programUrls = [];
    const list = doc.querySelectorAll(".course-finder > ul > li > a");
    list.forEach(a => {
        const url = SFU_BASE_URL + a.href;
        isValidUrl(url);
        programUrls.push(url);
    });
    const uniqueUrls = [...new Set(programUrls)];
    return uniqueUrls;
}
    
/**
* Return an array of all sub-urls of courses in Academic Calander Program
* e.g. ["/students/calendar/2023/spring/courses/cmpt/102.html", "/students/calendar/2023/spring/courses/cmpt/105.html", ...]
* @param {String} html Academic Calander Program Url
* @return {String}[]
*/
const collectCourseURLsFromProgramHTML = async (html) => {
    const doc = createDOM(html);
    const courseUrls = [];
    const list = doc.querySelectorAll("section.main > h3 > a");
    list.forEach(a => {
        const url = SFU_BASE_URL + a.href;
        isValidUrl(url);
        courseUrls.push(url);
    });
    const uniqueUrls = [...new Set(courseUrls)];
    return uniqueUrls;
}

/**
* Return all available courses in Academic Calender
* @return {Course}[]
*/
export const getAllCourses = async () => {
    const academicCalander = await downloadHTMLFromURL(SFU_ACADEMIC_CALENDER_URL);
    const programUrls = await collectProgramURLsFromCalenderHTML(academicCalander);

    const courseUrls = await promiseWindow(
        PROMISE_WINDOW_SIZE.MEDIUM, 
        programUrls, 
        (url) => new Promise((resolve, _) => {
            console.log(`Request URL:${url}`);
            downloadHTMLFromURL(url)
                .then(html => collectCourseURLsFromProgramHTML(html))
                .then(courseUrls => resolve(courseUrls))
        })
    ).then(urlSets => urlSets.flat(Infinity));

    const courses = await promiseWindow(
        PROMISE_WINDOW_SIZE.MEDIUM,
        courseUrls,
        (url) => new Promise((resolve, _) => {
            console.log(`Request URL:${url}`);
            downloadHTMLFromURL(url)
                .then(html => new Course(html))
                .then(course => resolve(course))
        })
    ).then(urlSets => urlSets.flat(Infinity));

    return courses;
}

/**
* Return Professor ratings for a given professor name
* @return {RmpSearchResultCollection}
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
    getRmpSearchResultCollection,
    getAllCourses
}

getAllCourses();