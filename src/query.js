//import ProgramList from "./models/ProgramList";

/**
 * query.js
 * 
 * get raw HTML for give url string
 * 
 * wrap the raw html into a HTML model and return
 * 
 */

const AVAILABLE_PROGRAMS_URL = "https://www.sfu.ca/students/calendar/courses.html";

const getSfuProgramList = async () => {

    const response = await fetch("https://www.sfu.ca/students/calendar/courses.html", {
        headers: {
            "User-Agent": "SFU_RMP"
        },
        redirect: 'follow',
        mode: 'no-cors',
    })
        .then(res => res.redirected ? res.redirect(res.url) : res)
        .then(res => res.text());

    console.log(response);
}

getSfuProgramList();