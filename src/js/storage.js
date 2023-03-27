import { getCurrentSemester } from "./web/sfu.js";
import Course from "./models/Course.js";
import ProfessorRating from "./models/ProfessorRating.js";
import Section from "./models/Section.js";

export default class LocalStorage {

    static store(key, value) {
        var obj = {};
        obj[key] = value;
        chrome.storage.local.set(obj);
        return obj;
    }

    static async retrieve(key) {
        const data = await chrome.storage.local.get(key);
        return data[key];
    }

    static clear() {
        chrome.storage.local.clear();
    }
}

const SFU_COURSE_LIST = "sfu_course_list";
const SFU_CURRENT_SEMESTER = "sfu_current_semester";
const RMP_PROFESSOR_RATINGS = "rmp_professor_ratings";

/**
 * 
 * @param {Object[]} courses 
 */
export function saveCourseListInLocalStorage(courses) {
  LocalStorage.store(SFU_COURSE_LIST, courses);
  LocalStorage.store(SFU_COURSE_LIST + "_FLAG", true);
  LocalStorage.store(SFU_CURRENT_SEMESTER, getCurrentSemester());
  return courses;
}

/**
 * @returns {Promise<Course[]>}
 */
export async function retrieveCourseListFromStorage() {
    const courseListObjects = await LocalStorage.retrieve(SFU_COURSE_LIST);
    const courses = [];
    courseListObjects.forEach(obj => {
        const sections = obj.sections.map(s => Object.assign(new Section, s));
        const course = Object.assign(new Course(), obj);
        course.sections = sections;
        courses.push(course);
    });
    return courses;
}

/**
 * @return {Promise<Boolean>}
 */
export async function checkCourseListPresentInStorage() {
    if (!await LocalStorage.retrieve(SFU_COURSE_LIST + "_FLAG"))
        return false;
    let semester = await LocalStorage.retrieve(SFU_CURRENT_SEMESTER);
    if (!semester || !(JSON.stringify(semester) === JSON.stringify(getCurrentSemester())))
        return false;
    return true;
}

/**
 * @param {Object { [professorName: String]: Object }} professorRatingDictionary
 */
export function saveProfessorRatingDictionary(professorRatingDctionary) {
    LocalStorage.store(RMP_PROFESSOR_RATINGS, professorRatingDctionary);
    LocalStorage.store(RMP_PROFESSOR_RATINGS + "_FLAG", true);
}

/**
 * @returns {Object { [professorName: String]: ProfessorRating }}
 */
export async function retrieveProfessorRatingDictionary() {
    const professorRatings = await LocalStorage.retrieve(RMP_PROFESSOR_RATINGS);
    return Object.fromEntries(Object.entries(professorRatings).map(([professorName, professorRating]) => [professorName, Object.assign(new ProfessorRating(), professorRating)]));
}

/**
 * @return {Promise<Boolean>}
 */
export async function checkProfessorRatingDictionaryPresentInStorage() {
    if (await LocalStorage.retrieve(RMP_PROFESSOR_RATINGS + "_FLAG") !== true)
        return false;
    return true;
}

export function invalidateStorageData() {
    LocalStorage.clear();
    return;
}