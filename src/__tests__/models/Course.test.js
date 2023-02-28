/**
 * @jest-environment node
 */

import Course from "../../js/models/Course.js";

describe("test course detail search result html validation", () => {
    test("should throw error when html does not contain required content wrapper", () => {
        const fn = () => {
            const html =
            '<section class="main">'+
            '  <div class="above-main inherited-parsys">'+
            '  </div>'+
            '  <h1>'+
            '  </h1>'+
            '  <p>'+
            '  </p>'+
            '</section>';
            new Course(html);
        };
        expect(fn).toThrow(Error);
        expect(fn).toThrow("Invalid HTML");
    });

    test("should return true when html contains required content wrapper(sections not provided)", () => {
        const fn =() => {
            const html =
            '<section class="main">'+
            '  <div class="above-main inherited-parsys">'+
            '  </div>'+
            '  <h1>'+
            '  </h1>'+
            '  <p>'+
            '  </p>'+
            '  <div class="below-main inherited parsys">'+
            '  </div>'+
            '</section>';
            new Course(html);
        };
        expect(fn).not.toThrow(Error);
    });

    test("should return true when html contains required content wrapper", () => {
        const fn =() => {
            const html =
            '<section class="main">'+
            '  <div class="above-main inherited-parsys">'+
            '  </div>'+
            '  <h1>'+
            '  </h1>'+
            '  <p>'+
            '  </p>'+
            '  <div class="four-columns course-sections">'+
            '  <small class="course_number"> CMPT 300 (3) </small>'+
            '  <tr class="main-section">'+
            '    <td>'+
            '      <a href="http://www.sfu.ca/outlines.html?2023/spring/cmpt/300/d100" target="_blank">D100</a>'+
            '    </td>'+
            '    <td>'+
            '        " Steven Ko"'+
            '        <br>'+
            '    </td>'+
            '  </tr>'+
            '  </div>'+
            '</section>';
            new Course(html);
        };
        expect(fn).not.toThrow(Error);
    });
});

describe("test course detail search result parsing to course detail models", () => {

    const fs = require('fs');
    const path = require('path');
    
    const html = fs.readFileSync(path.join(__dirname, "../resources/", "course_detail_sample.html")).toString();

    test("should create two course details corresponding to two courses found on search", () => {
        const course = new Course(html);
        expect(course.getSections().length).toBe(2);
        expect(course.getProgram().length).toBe(1);
        expect(course.getCourseNumber().length).toBe(1);

    });

    test("should create two course details with correct values of properties", () => {
        const course = new Course(html);
        const sections = course.getSections();
        const program = course.getProgram();
        const courseNumber = course.getCourseNumber();

        expect(program.getProgram()).toBe("CMPT");
        expect(courseNumber.getCourseNumber()).toBe("300");

        expect(sections[0].getSection()).toBe("D100");
        expect(sections[0].getProfessorName()).toBe("Steven Ko");

        expect(sections[1].getSection()).toBe("D200");
        expect(sections[1].getProfessorName()).toBe("Harinder Khangura");
    });
});