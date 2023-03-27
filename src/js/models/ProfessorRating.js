export default class ProfessorRating {

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

    /**
     * 
     * @returns {Integer} number in range 0.0 - 1.0
     * @returns {null} if data not present
     */
    getWouldLikeToTakeAgainRatio() {
        return this.wouldLikeToTakeAgainRatio;
    }
}