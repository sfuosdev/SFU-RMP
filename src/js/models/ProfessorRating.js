class ProfessorRating {

    constructor(professorName, department, numOfRatings, avgQuality, difficulty, retakeRatio) {
        this.professorName = professorName;
        this.department = department;
        this.numOfRatings = numOfRatings;
        this.difficulty = difficulty;
        this.avgQuality = avgQuality;
        this.retakeRatio = retakeRatio;
    }

    getProfessorName() {
        return this.professorName;
    }

    getDepartment() {
        return this.department;
    }

    getNumOfRatings() {
        return this.numOfRatings;
    }

    getAverageQuality() {
        return this.avgQuality;
    }

    getDifficulty() {
        return this.difficulty;
    }

    getRetakeRatio() {
        return this.retakeRatio;
    }
}

export default ProfessorRating;