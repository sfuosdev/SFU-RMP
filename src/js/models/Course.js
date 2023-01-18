import HtmlModel from "./HtmlModel";

class Course extends HtmlModel {
    
    constructor(rawHtml) {
        super(rawHtml);
        this.sections = this.parse(doc);
    }

    validate(doc) {
        // ...
    }

    parse(doc) {
        // ...
    }

    getSessions() {
        return this.sections;
    }
}

export default Course;