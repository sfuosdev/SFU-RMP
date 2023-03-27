import Section from "./Section.js";

export default class Course {

    /**
     * @param {String} programName 
     * @param {String} courseNumber 
     * @param {Section} sections 
     */
    constructor(programName, courseNumber, sections = []) {
        this.sections = sections;
        this.program = programName;
        this.courseNumber = courseNumber;
    }

    getProgram(){
        return this.program;
    }

    getCourseNumber(){
        return this.courseNumber;
    }

    getSections() {
        return this.sections;
    }
}