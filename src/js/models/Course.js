import { createDOM } from "../utils.js";
import Section from "./Section";

class Course {

    constructor(rawHtml) {
        this.sections = [];
        this.program = '';
        this.courseNumber = undefined;
        this.validate(rawHtml);
        this.parse(rawHtml);
    }

    validate(rawHtml) {
        const doc = createDOM(rawHtml);
        const courseWrapper = doc.querySelector("section.main");
        if(!courseWrapper)
            throw new Error("Invalid HTML");
        else{
            const courseInfo = courseWrapper.querySelector("small.course_number").innerHTML.replace(/(\r\n|\n|\r)/gm, "").split("\t").filter(str => str != '');
            [
                courseInfo[0],
                courseInfo[1]
            ].forEach(element => {
                if(!element)
                    throw new Error("Invalid HTML")
            });
            const sections = courseWrapper.querySelectorAll("tr.main-section");
            sections.forEach(section => {
                if (section.querySelectorAll("td") < 4)
                    throw new Error("Invalid HTML");
            });
        }
        return true;
    }

    parse(rawHtml) {
        const doc = createDOM(rawHtml);
        const courseWrapper = doc.querySelector("section.main");
        const courseInfo = courseWrapper.querySelector("small.course_number").innerHTML.replace(/(\r\n|\n|\r)/gm, "").split("\t").filter(str => str != '');
        this.program = courseInfo[0];
        this.courseNumber = courseInfo[1];

        const sections = [];
        const sectionWrappers = courseWrapper.querySelectorAll("tr.main-section");
        sectionWrappers.forEach(wrapper => {
            const boxes = wrapper.querySelectorAll("td");
            const section = boxes[0].querySelector("a").innerHTML.trim();
            const professorName = boxes[1].textContent.trim();
            sections.push(new Section(section, professorName));
        });
        this.sections = sections;
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

export default Course;