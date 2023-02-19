class Section {
    
    constructor(section, professorName) {
        this.section = section;
        this.professorName = professorName;
    }

    getSection() {
        return this.section;
    }

    getProfessorName() {
        return this.professorName;
    }
}

export default Section;