/**
 * @jest-environment node
 */

import RmpSearchResultCollection from "../../js/models/RmpSearchResultCollection.js";

describe("test rate my professor search result html validation", () => {
    test("should throw error when html does not contain required content wrapper", () => {
        const fn = () => {
            const html = 
            '<div class="random_div_id_1234442">' +
            '  <div">' +
            '  </div>' +
            '  <div>' +
            '  </div>' +
            '</div>';
            new RmpSearchResultCollection(html);
        };
        expect(fn).toThrow(Error);
        expect(fn).toThrow("Invalid HTML");
    });

    test("should return true when html contains required content wrapper", () => {
        const fn = () => {
            const html = 
            '<div class="TeacherCard__InfoRatingWrapper-syjs0d-3 kcbPEB">' +
            '  <div class="CardName__StyledCardName">' +
            '      "Jason"' +
            '      "Bell"' +
            '  </div>' +
            '  <div class="CardSchool__Department">Computer Science</div>' +
            '  <div class="CardNumRating__CardNumRatingCount">25 ratings</div>' +
            '  <div class="CardNumRating__CardNumRatingNumber">3.9</div>' +
            '  <div class="CardFeedback__CardFeedbackNumber">N/A</div>' +
            '  <div class="CardFeedback__CardFeedbackNumber">2.6</div>' +
            '</div>';
            new RmpSearchResultCollection(html);
        };
        expect(fn).not.toThrow(Error);
    });
})

describe("test rate my professor search result parsing to professor rating models", () => {

    const fs = require( 'fs' );
    const path = require("path");

    const html = fs.readFileSync(path.join(__dirname, "../resources/", "rmp_search_result_sample.html")).toString();

    test("should create three professor ratings corresponding to three professor found on search", () => {
        const rmpSearchResultCollection = new RmpSearchResultCollection(html);
        expect(rmpSearchResultCollection.getProfessorRatings().length).toBe(3);
    });

    test("should create three professor ratings with correct values of properties", () => {
        const rmpSearchResultCollection = new RmpSearchResultCollection(html);
        const professorRatings = rmpSearchResultCollection.getProfessorRatings();

        expect(professorRatings[0].getProfessorName()).toBe("Simi Kohli");
        expect(professorRatings[0].getDepartment()).toBe("Kinesiology");
        expect(professorRatings[0].getNumOfRatings()).toBe(14);
        expect(professorRatings[0].getAverageQuality()).toBe(3.9);
        expect(professorRatings[0].getDifficulty()).toBe(2.6);
        expect(professorRatings[0].getRetakeRatio()).toBe(NaN);

        expect(professorRatings[1].getProfessorName()).toBe("Simin Najmi");
        expect(professorRatings[1].getDepartment()).toBe("Physics");
        expect(professorRatings[1].getNumOfRatings()).toBe(2);
        expect(professorRatings[1].getAverageQuality()).toBe(5.0);
        expect(professorRatings[1].getDifficulty()).toBe(1.5);
        expect(professorRatings[1].getRetakeRatio()).toBe(NaN);

        expect(professorRatings[2].getProfessorName()).toBe("Simin Bagheri Najmi");
        expect(professorRatings[2].getDepartment()).toBe("Physics");
        expect(professorRatings[2].getNumOfRatings()).toBe(16);
        expect(professorRatings[2].getAverageQuality()).toBe(3.8);
        expect(professorRatings[2].getDifficulty()).toBe(2.3);
        expect(professorRatings[2].getRetakeRatio()).toBe(0.82);
    })
});