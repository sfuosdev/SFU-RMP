export default class Section {
    
    constructor(section, professors) {
        this.section = section;
        this.professors = professors;
    }

    /**
     * 
     * @returns {String} section code
     */
    getSection() {
        return this.section;
    }

    /**
     * @returns {String[]} names of assigned professors
     */
    getProfessors() {
        return this.professors;
    }

    /**
     * @returns {String} name of primary professor
     */
    getPrimaryProfessor() {
        if (this.professors.length > 0)
            return this.professors[0];
        else
            return null;
    }
}