class Session {
    
    professorName;
    section;

    constructor(professorName, section) {
        this.professorName = professorName;
        this.section = section;
    }

    getProfessorName() {
        return this.professorName;
    }

    getSection() {
        return this.section;
    }
}

export default Session;