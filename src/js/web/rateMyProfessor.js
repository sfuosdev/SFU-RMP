import { parseHtmlToProfessorRatings } from "../html/parser.js";
import ProfessorRating from "../models/ProfessorRating.js";
import { retrieveCourseListFromStorage, retrieveProfessorRatingDictionary } from "../storage.js";

const RMP_SEARCH_BASE_URL = "https://www.ratemyprofessors.com/search/teachers";
const RMP_SFU_SID = "U2Nob29sLTE0ODI=";

let coursesFromStorage;
let ratingDictionaryFromStorage;

export const rmpSearchURL = (professorName) => {
    const query = "query=" + professorName;
    const sid = "sid=" + RMP_SFU_SID; 
    const url = encodeURI(RMP_SEARCH_BASE_URL + "?" + query + "&" + sid);
    return url;
}

export const parseRmpSearchResultHtml = (html) => {
    return parseHtmlToProfessorRatings(html);;
}

export const findProfessorRatingsByCourseSection = async (programName, courseNumber, sectionCode) => {
    if (!coursesFromStorage) coursesFromStorage = await retrieveCourseListFromStorage();
    if (!ratingDictionaryFromStorage) ratingDictionaryFromStorage = await retrieveProfessorRatingDictionary();

    const ratings = [];
    for (let course of coursesFromStorage) {
        if (course.getProgram() === programName && course.getCourseNumber() === courseNumber) {
            for (let section of course.getSections()) {
                if (section.getSection() === sectionCode) {
                    section.getProfessors().forEach(profName => {
                        if (ratingDictionaryFromStorage[profName])
                            ratings.push(ratingDictionaryFromStorage[profName]);
                        else
                            ratings.push(new ProfessorRating(profName, "unknown", 0, null, null, null));
                    });
                }
            }
        }
    }
    return ratings;
}