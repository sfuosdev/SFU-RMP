/**
 * @jest-environment node
 */

import fs from "fs";
import path from "path";
import { validateCourseDetailHTML, validateRMPSearchResultHTML } from "../../js/html/validator.js";
import { parseHtmlToCourse, parseHtmlToProfessorRatings } from "../../js/html/parser.js";

jest.mock("../../js/html/validator");

describe("test praser works on course detail html page to course model", () => {
    
    const courseGeneral = fs.readFileSync(path.join(__dirname, "../resources/", "course_detail_sample.html")).toString();
    const courseWithMultiProfInOneSectionBox = fs.readFileSync(path.join(__dirname, "../resources/", "course_detail_sample_two_profs_in_one_section.html")).toString();

    test("should create CMPT 120 course", () => {
        const course = parseHtmlToCourse(courseGeneral);
        expect(course.getProgram()).toBe("CMPT");
        expect(course.getCourseNumber()).toBe("120");
    });

    test("should create two sections: D100 Hazra Imran, and D200 Victor Cheung", () => {
        const course = parseHtmlToCourse(courseGeneral);
        const sections = course.getSections();
        expect(sections.length).toBe(2);
        expect(sections[0].getSection()).toBe("D100");
        expect(sections[0].getPrimaryProfessor()).toBe("Hazra Imran");
        expect(sections[1].getSection()).toBe("D200");
        expect(sections[1].getPrimaryProfessor()).toBe("Victor Cheung");
    });

    test("should create one section with two professors assigned", () => {
        const course = parseHtmlToCourse(courseWithMultiProfInOneSectionBox);
        const sections = course.getSections();
        expect(sections.length).toBe(1);
        expect(sections[0].getSection()).toBe("G100");
        expect(sections[0].getProfessors()[0]).toBe("Andrea FAmmartino");
        expect(sections[0].getProfessors()[1]).toBe("Anil Aggarwal");
    });
});

describe("test parser works on rate my professor search result html to professor rating models", () => {

    const html = fs.readFileSync(path.join(__dirname, "../resources/", "rmp_search_result_sample.html")).toString();

    test("should create three professor ratings with correct properties", () => {
        const professorRatings = parseHtmlToProfessorRatings(html);
        expect(professorRatings.length).toBe(3);

        expect(professorRatings[0].getProfessorName()).toBe("Simi Kohli");
        expect(professorRatings[0].getDepartment()).toBe("Kinesiology");
        expect(professorRatings[0].getNumOfRatings()).toBe(14);
        expect(professorRatings[0].getAverageQuality()).toBe(3.9);
        expect(professorRatings[0].getDifficulty()).toBe(2.6);
        expect(professorRatings[0].getWouldLikeToTakeAgainRatio()).toBe(null);

        expect(professorRatings[1].getProfessorName()).toBe("Simin Najmi");
        expect(professorRatings[1].getDepartment()).toBe("Physics");
        expect(professorRatings[1].getNumOfRatings()).toBe(2);
        expect(professorRatings[1].getAverageQuality()).toBe(5.0);
        expect(professorRatings[1].getDifficulty()).toBe(1.5);
        expect(professorRatings[1].getWouldLikeToTakeAgainRatio()).toBe(1.0);

        expect(professorRatings[2].getProfessorName()).toBe("Simin Bagheri Najmi");
        expect(professorRatings[2].getDepartment()).toBe("Physics");
        expect(professorRatings[2].getNumOfRatings()).toBe(16);
        expect(professorRatings[2].getAverageQuality()).toBe(3.8);
        expect(professorRatings[2].getDifficulty()).toBe(2.3);
        expect(professorRatings[2].getWouldLikeToTakeAgainRatio()).toBe(0.83);
    })
});