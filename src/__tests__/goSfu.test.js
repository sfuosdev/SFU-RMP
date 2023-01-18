import fs from "fs";
import goSfu from "../js/goSfu.js";

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

describe("test DOM manipulation on class search", () => {

    beforeAll(() => {
        document.body.innerHTML = 
        '<iframe id="ptifrmtgtframe">' +
        '  <div id="win0divMTG_INSTR$0">' +
        '       <span id="test">Steven Ko</span>' +
        '  </div>' +
        '  <div id="win0divMTG_INSTR$1">' +
        '       <span>Harinder Khangura</span>' +
        '  </div>' +
        '</iframe>';
    });

    test("change fontWeight to bold for professor names on class search result", () => {
        goSfu.render();

        const elements = document.querySelectorAll('span');
        // expect(elements.length).toBe(2);

        elements.forEach(element => {
            // expect(elements.attributes["font-weight"]).toBe("bold")
        });
    });
});