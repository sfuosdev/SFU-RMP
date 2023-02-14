import ProfessorRating from "./models/ProfessorRating";
import { store, retrieve } from "./storage";
import { getRmpSearchResultCollection } from "./query";

function serializeCacheKey(program, courseNumber, section, profressorName) {
    return program + courseNumber + "-" + section + "-" + profressorName;
}

/**
 * @param {String} key
 * @param {ProfessorRating} rmpRating 
 */
function saveCache(key, rmpRating) {
    const data = {
        professorName: rmpRating.getProfessorName(),
        department: rmpRating.getDepartment(),
        numOfRatings: rmpRating.getNumOfRatings(),
        avgQuality: rmpRating.getAverageQuality(),
        difficulty: rmpRating.getDifficulty(),
        wouldLikeToTakeAgainRatio: rmpRating.getWouldLikeToTakeAgainRatio()
    }
    store(key, data);
    return data;
}

/**
 * @returns ProfessorRating
 * @return undefined if professor name not found in SFU Academic Calander or RMP search result
 */
export async function getProfessorRating(program, courseNumber, section) {
    const courseData = await retrieve('courseData');
    const professorName = courseData[program]?.[courseNumber]?.[section];

    if (professorName) {
        const key = serializeCacheKey(program, courseNumber, section, professorName);
        var cache = await retrieve(key);
        if (cache) {
            const rmpRating = new ProfessorRating(cache.professorName, cache.department, cache.numOfRatings, cache.avgQuality, cache.difficulty, cache.wouldLikeToTakeAgainRatio);
            return rmpRating;
        }
        else {
            const rmpSearchResults = await getRmpSearchResultCollection(professorName);
            if (rmpSearchResults.isEmpty())
                return undefined;
            else {
                const rmpRating = rmpSearchResults.getFirstResult();
                saveCache(key, rmpRating);
                return rmpRating;
            }
        }
    }
    else 
        return undefined;
}