import HtmlModel from "./HtmlModel.js";
import Section from "./Section";

class Course extends HtmlModel {
    
    constructor(rawHtml) {
        super(rawHtml);
        this.sections = this.parse(this.doc);
    }

    validate(doc) {
        const courseWrapper = doc.querySelector("section.main");
        if(!courseWrapper)
            throw new Error("Invalid HTML");
        else{
            courseWrapper.forEach(wrapper => {
                [
                    wrapper.querySelector("title"), // program // ".breadcrumb"
                    wrapper.querySelector("title"), // course number
                    // wrapper.querySelector(`[href^=http://www.sfu.ca/outlines.html]`), // section
                    wrapper.querySelectorAll("td") // professor name & section // <td> name </td>

                ].forEach(wrapper => {
                    if (!wrapper)
                        throw new Error("Invalid inner HTML");
                })
            });
        }
        return true;
    }
    // program, courseNumber, section, professorName

    parse(doc) {
        const sections = [];
        
        const sectionWrappers = doc.querySelectorAll("tr.main-section");
        sectionWrappers.forEach(wrapper => {
            const program = wrapper.querySelector("title").innerHTML.split(" ")[0].trim(); // ex. CMPT
            const courseNumber = wrapper.querySelector("title").innerHTML.split(" ")[1].trim(); // ex. 105W
            // const section = wrapper.querySelector(`[href^=http://www.sfu.ca/outlines.html]`).innerHTML.trim(); // ex. E100
            const section = wrapper.querySelectorAll("td").innerHTML.slice(0,1).trim();
            // const professorName = wrapper.querySelector("td").innerHTML.replace(/"|'/g, '').replace(/\s+/g, ' ').trim(); // ex. Steven Ko
            const professorName = wrapper.querySelectorAll("td").innerHTML.slice(1,2).trim();

            const pairs = new Section(program, courseNumber, section, professorName);
            sections.push(pairs);
        });

        return sections;
    }

    getSections() {
        return this.sections;
    }
}

export default Course;