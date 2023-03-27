/**
 * @jest-environment node
 */

import { HtmlValidationError } from "../../js/errors.js";
import { validateCourseDetailHTML, validateRMPSearchResultHTML } from "../../js/html/validator.js";

describe("test course detail html validation", () => {
    test("should throw error when missing section.main", () => {
        const fn = () => {
            const html =
            '<section>'+
            '  <p>'+
            '  </p>'+
            '</section>';
            validateCourseDetailHTML(html);
        };
        expect(fn).toThrow(HtmlValidationError);
        expect(fn).toThrow("Required element not found: section.main");
    });

    test("should throw error when missing small.course_number", () => {
        const fn = () => {
            const html =
            '<section class="main">'+
            '  <div>'+
            '  </div>'+
            '  <h1>'+
            '   <small>'+
            '   </small>'+
            '  </h1>'+
            '</section>';
            validateCourseDetailHTML(html);
        };
        expect(fn).toThrow(HtmlValidationError);
        expect(fn).toThrow("Required element not found: small.course_number");
    });

    test("should not to throw error when all required wrappers present", () => {
        const fn = () => {
            const html =
            '<section class="main">'+
            '  <div>'+
            '  </div>'+
            '  <h1>'+
            '   <small class="course_number"> CMPT \t 120 </small>'+
            '  </h1>'+
            '  <div>'+
            '   <div>'+
            '    <table>'+
            '       <tbody>'+
            '           <tr class="main-section">'+
            '           </tr>'+
            '       </tbody>'+
            '    </table>'+
            '   </div>'+
            '  </div>'+
            '</section>';
            validateCourseDetailHTML(html);
        };
        expect(fn).not.toThrow(Error);
        expect(fn).not.toThrow(HtmlValidationError);
    });
});

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
            validateRMPSearchResultHTML(html);
        };
        expect(fn).toThrow(HtmlValidationError);
        expect(fn).toThrow("Required element not found: [class^=TeacherCard__InfoRatingWrapper]");
    });

    test("should not throw error when html contains all required wrappers present", () => {
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
            validateRMPSearchResultHTML(html);
        };
        expect(fn).not.toThrow(Error);
        expect(fn).not.toThrow(HtmlValidationError);
    });
})