import { parseHtmlToCourse, parseHtmlToCourseUrls, parseHtmlToProgramUrls } from "../html/parser.js";
import { downloadHTMLFromURL, promiseWindow, PROMISE_WINDOW_SIZE } from "./utils.js";

const SFU_BASE_URL = "https://www.sfu.ca/";

/**
 * @returns {[(String), (Number)]} [semester, year]
 */
export const getCurrentSemester = () => {
    var current = new Date();
    var month = current.getMonth();
    var year = current.getFullYear();
    var sem = "fall"
    if(month>=1 && month <5){
        sem = "summer"
    }
    else if(month>=5 && month <9){
        sem = "fall"
    }
    else{
        sem = "spring"
    }
    return [sem, year];
}

const dynamicAcademicCalenderURL = ()=>{
    var [sem, year] = getCurrentSemester();
    const res = SFU_BASE_URL + "students/calendar/"+year+"/"+sem+"/courses/";
    return res;
}

/**
 * @returns {Promise<String>} SFU Academic Calendar raw HTML string
 */
const downloadSfuAcademicCalendarHTML = async () => {
    const academicCalander = await downloadHTMLFromURL(dynamicAcademicCalenderURL());
    return academicCalander;
}

/**
 * @returns {Promise<String[]>} an array of URL strings of all programs offered by SFU
 */
export const sfuProgramPageUrls = async () => {
    const academicCalander = await downloadSfuAcademicCalendarHTML();
    const programUrls = parseHtmlToProgramUrls(academicCalander).map(url => SFU_BASE_URL + url);
    return programUrls;
}

/**
 * 
 * @param {String} programUrl URL to SFU program page 
 * @returns {Promise<Course[]>} an array of Course objects
 */
export const sfuCoursesInProgram = async (programUrl) => {
    const programHtml = await downloadHTMLFromURL(programUrl);
    const courseUrls = parseHtmlToCourseUrls(programHtml).map(url => SFU_BASE_URL + url);

    const courses = await promiseWindow(
        PROMISE_WINDOW_SIZE.LARGE,
        courseUrls,
        (url) => new Promise((resolve, _) => {
            try {
                downloadHTMLFromURL(url)
                    .then(html => parseHtmlToCourse(html))
                    .then(course => resolve(course))
            } catch (error) {
                console.log(`Error reading Course HTML: ${error.toString()}`)
                resolve(null);
            }
        })
    ).then(courseSet => courseSet.flat(Infinity))
    .then(courseSet => courseSet.filter(Boolean));
    
    return courses;
}