import HtmlModel from "./HtmlModel.js";
import ProfessorRating from "./ProfessorRating.js";



class RmpSearchResultCollection extends HtmlModel {

    constructor(rawHtml) {
        super(rawHtml);
        this.professorRatings = this.parse(this.doc);
    }

    validate(doc) {
        const searchResultWrapper = doc.querySelectorAll(`[class^=TeacherCard__InfoRatingWrapper]`);
        if (!searchResultWrapper.length)
            throw new Error("Invalid HTML");
        else {
            searchResultWrapper.forEach(wrapper => {
                [
                    wrapper.querySelector(`[class^=CardName__StyledCardName]`),
                    wrapper.querySelector(`[class^=CardSchool__Department]`),
                    wrapper.querySelector(`[class^=CardNumRating__CardNumRatingCount]`),
                    wrapper.querySelector(`[class^=CardNumRating__CardNumRatingNumber]`)
                ].forEach(wrapper => {
                    if (!wrapper)
                        throw new Error("Invalid inner HTML");
                })
                if(!wrapper.querySelectorAll(`[class^=CardFeedback__CardFeedbackNumber]`))
                    throw new Error("Invalid inner HTML");
            });
        }
        return true;
    }

    parse(doc) {
        const professorRatings = [];

        const ratingWrappers = doc.querySelectorAll(`[class^=TeacherCard__InfoRatingWrapper]`);
        ratingWrappers.forEach(wrapper => {
            const name = wrapper.querySelector(`[class^=CardName__StyledCardName]`).innerHTML.replace(/"|'/g, '').replace(/\s+/g, ' ').trim();
            const department = wrapper.querySelector(`[class^=CardSchool__Department]`).innerHTML;
            const numOfRatings = parseInt(wrapper.querySelector(`[class^=CardNumRating__CardNumRatingCount]`).innerHTML.replace(/\D/g,''));
            const quality = parseFloat(wrapper.querySelector(`[class^=CardNumRating__CardNumRatingNumber]`).innerHTML);

            const feedbacks = wrapper.querySelectorAll(`[class^=CardFeedback__CardFeedbackNumber]`);
            const retakeRatio = parseFloat(feedbacks[0].innerHTML.replace(/\D/g,'')) / 100;
            const difficulty = parseFloat(feedbacks[1].innerHTML);

            const rating = new ProfessorRating(name, department, numOfRatings, quality, difficulty, retakeRatio);
            professorRatings.push(rating);
        });

        return professorRatings;
    }

    getProfessorRatings() {
        return this.professorRatings;
    }

    getFirstResult() {
        if (!this.isEmpty())
            return this.professorRatings[0];
        throw new Error("Search result is empty");
    }

    isEmpty() {
        return this.professorRatings.length ? false : true;
    }
}

export default RmpSearchResultCollection;