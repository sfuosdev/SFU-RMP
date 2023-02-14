class Section {
    
    constructor(program, courseNumber, section, professorName) {
        this.program = program;
        this.courseNumber = courseNumber;
        this.section = section;
        this.professorName = professorName;
    }

    getProgram(){
        return this.program;
    }

    getCourseNumber(){
        return this.courseNumber;
    }

    getSection() {
        return this.section;
    }

    getProfessorName() {
        return this.professorName;
    }
}

export default Section;