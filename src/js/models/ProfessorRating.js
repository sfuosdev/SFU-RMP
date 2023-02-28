class ProfessorRating {

    constructor(professorName, department, numOfRatings, avgQuality, difficulty, wouldLikeToTakeAgainRatio) {
        this.professorName = professorName;
        this.department = department;
        this.numOfRatings = numOfRatings;
        this.difficulty = difficulty;
        this.avgQuality = avgQuality;
        this.wouldLikeToTakeAgainRatio = wouldLikeToTakeAgainRatio;
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

    getWouldLikeToTakeAgainRatio() {
        return this.wouldLikeToTakeAgainRatio;
    }
}

export default ProfessorRating;