/**
 * @jest-environment node
 */

import { when } from 'jest-when'
import { getProfessorRating } from "../js/rmp";
import { store, retrieve } from "../js/storage";
import { getRmpSearchResultCollection } from "../js/query";
import ProfessorRating from "../js/models/ProfessorRating";

jest.mock("../js/storage");
jest.mock("../js/query");

const fixture = {
    rmpRatingCache: {
        professorName: 'Steve Ko',
        department: 'mathematics',
        numOfRatings: 17,
        avgQuality: 3.2,
        difficulty: 4.2,
        wouldLikeToTakeAgainRatio: 0.34
    },
    rmpRatingObject: new ProfessorRating('Steve Ko', 'mathematics', 17, 3.2, 4.2, 0.34)
}

beforeEach(() => {
    store.mockClear();
    retrieve.mockClear();
    getRmpSearchResultCollection.mockClear();
});

describe("test RMP failures", () => {
    test("should return undefined if professor name is not found in SFU Academic Calander", async () => {
        when(retrieve).calledWith('courseData').mockReturnValueOnce({});
        let result = await getProfessorRating('CMPT', 300, 'D100');
        expect(result).toBe(undefined);
    });
    
    test("should return undefined if professor not found in RMP search result", async () => {
        when(retrieve).calledWith('CMPT300-D100-Steve Ko').mockReturnValue(undefined);
        when(retrieve).calledWith('courseData').mockReturnValueOnce({
            "CMPT": {
                "300": {
                    "D100": "Steve Ko"
                } 
            }
        });
        when(getRmpSearchResultCollection).calledWith("Steve Ko").mockReturnValue({ isEmpty: () => true });
        let result = await getProfessorRating('CMPT', 300, 'D100');
        expect(result).toBe(undefined);
    });
});

describe("test RMP successes", () => {
    test("should concatenate program, course number, course section, and professor name to generate cache key string", async () => {
        when(retrieve).calledWith('courseData').mockReturnValueOnce({
            "CMPT": {
                "300": {
                    "D100": "Steve Ko"
                } 
            }
        });
        await getProfessorRating('CMPT', 300, 'D100');
        expect(retrieve).toHaveBeenCalledWith('CMPT300-D100-Steve Ko')
    });


    test("should return RMP rating if professor name found in SFU Academic Calander and previously cached", async () => {
        when(retrieve).calledWith('CMPT300-D100-Steve Ko').mockReturnValue(fixture.rmpRatingCache);
        when(retrieve).calledWith('courseData').mockReturnValueOnce({
            "CMPT": {
                "300": {
                    "D100": "Steve Ko"
                } 
            }
        });
        let result = await getProfessorRating('CMPT', 300, 'D100');
        expect(result).not.toBe(undefined);
        expect(result.getProfessorName()).toBe('Steve Ko');
    });

    test("should return RMP rating if cache not found but professor found in RMP search result", async () => {
        when(retrieve).calledWith('CMPT300-D100-Steve Ko').mockReturnValue(undefined);
        when(retrieve).calledWith('courseData').mockReturnValueOnce({
            "CMPT": {
                "300": {
                    "D100": "Steve Ko"
                } 
            }
        });
        when(getRmpSearchResultCollection).calledWith("Steve Ko").mockReturnValue({ isEmpty: () => false, getFirstResult: () => fixture.rmpRatingObject });
        let result = await getProfessorRating('CMPT', 300, 'D100');
        expect(result).not.toBe(undefined);
        expect(result.getProfessorName()).toBe('Steve Ko');
    });

    test("should save RMP search result in local storage cache after retrieving RMP search result", async () => {
        when(retrieve).calledWith('CMPT300-D100-Steve Ko').mockReturnValue(undefined);
        when(retrieve).calledWith('courseData').mockReturnValueOnce({
            "CMPT": {
                "300": {
                    "D100": "Steve Ko"
                } 
            }
        });
        when(getRmpSearchResultCollection).calledWith("Steve Ko").mockReturnValue({ isEmpty: () => false, getFirstResult: () => fixture.rmpRatingObject });
        let result = await getProfessorRating('CMPT', 300, 'D100');
        expect(result).not.toBe(undefined);
        expect(store).toHaveBeenCalledWith('CMPT300-D100-Steve Ko', expect.objectContaining({
            professorName: 'Steve Ko',
            department: 'mathematics'
        }));
    });
});