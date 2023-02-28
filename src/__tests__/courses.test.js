/**
 * @jest-environment node
 */
 import { when } from 'jest-when'
import {collect,getCourseData } from "../js/courses";
import { store, retrieve, checkStorage } from "../js/storage";
import { getRmpSearchResultCollection, getAllCourses } from "../js/query";

jest.mock("../js/query");
jest.mock("../js/storage")



beforeEach(() => {
    store.mockClear();
    retrieve.mockClear();
    getRmpSearchResultCollection.mockClear();
});




const section1 = {
    getProfessorName: () => "Bobby Chan",
    getSection: ()=> "D100"
    }
const section2 = {
    getProfessorName: () => "Douglas Allen",
    getSection: ()=> "D100"
    }
const section3 = {
        getProfessorName: () => "Gordon Myers",
        getSection: ()=> "D200"
        }
          
const course1 = {
    getProgram: ()=> "CMPT",
    getCourseNumber: () => "272",
    getSections: () => [section1]
}

const course2 = {
    getProgram: ()=> "ECON",
    getCourseNumber: () => "103",
    getSections: () => [section2,section3]
}

const courseFixture = [course1,course2]

    
describe("test collect function success", () => {

    test("test collect function success on one program", async () => {
        when(getAllCourses).mockReturnValue([course1])
        await collect();
        expect((store.mock.calls[0][1])).toStrictEqual(
            {
                "CMPT": {
                    "272": {
                        "D100": "Bobby Chan"
                    } 
                }
            }

        );
    });
    test("test collect function success on multiple programs", async () => {
        when(getAllCourses).mockReturnValue(courseFixture)
        await collect();
        expect((store.mock.calls[0][1])).toStrictEqual(
            {
                "CMPT": {
                    "272": {
                        "D100": "Bobby Chan"
                    } 
                },
                "ECON": {
                         "103": {
                           "D100": "Douglas Allen",
                           "D200": "Gordon Myers"
                         },
                       },
            }

        );
    });
})

describe("test collect function when empty object returned from getAllCourses", () => {

    test("test collect function success on one program", async () => {
        when(getAllCourses).mockReturnValue({})
        let result = await collect();
        expect(result).toBe(undefined)
        
    });
})


describe("test getCourseData success", () => {
    test("should return retrieved data from local storage", async () => {
        when(retrieve).calledWith('courseData').mockReturnValueOnce({
            "CMPT": {
                "272": {
                    "D100": "Bobby Chan"
                } 
            }
        });
        when(checkStorage).calledWith('courseData').mockReturnValueOnce(true);
        let res = await getCourseData();
        expect(res).toStrictEqual({"CMPT": {"272": {"D100": "Bobby Chan"} }});
    });
})

describe("test no return results for getCourseData", () => {
    test("should return false if local storage is empty", async () => {
        when(retrieve).calledWith('courseData').mockReturnValueOnce({});
        let result = await getCourseData();
        expect(result).toBe(false);
    });
})






        