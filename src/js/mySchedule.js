import ProfessorRating from "./models/ProfessorRating.js";
import { getProfessorRating } from "./rmp.js";

numProf = 1
const updateInt = 5000;
// const rating = new ProfessorRating("professorName", "department", 50, 5, 3, 98);

function highlight(){
    const courses = document.getElementsByClassName("course_title");
    const ratings = [];
    let numProf = ratings.length();
    const programlst = [];
    const courseNumberlst = [];
    const rating = getProfessorRating(programlst[0], courseNumber[0], section)[0]
    for (let i = 0; i < courses.length; i++){
        const course = courses[i].innerHTML
        const courseTitle = course.split(" ");
        programlst.push = courseTitle[0];
        courseNumberlst.push = courseTitle[1];
    }

    let elementls = document.querySelectorAll('[title="Instructor(s)"]');
    for (let i = 0; i < elementls.length; i++){
        elementls[i].setAttribute('id','highlight'+[i]);
        let myDiv = document.getElementById('highlight'+[i]);
        let name = myDiv.innerHTML; 
        let myInstructorSpan = myDiv.querySelector("span.instructor");        
        if (!myInstructorSpan) {
            myDiv.innerHTML = ''; 
            myInstructorSpan = document.createElement("span");
            myInstructorSpan.classList.add("instructor");
            myInstructorSpan.innerHTML = name;
            myDiv.appendChild(myInstructorSpan);
        }
        if (!myInstructorSpan.querySelector("span.box") && numProf == 1) {
            let myInnerSpan = document.createElement("span");
            let ratingDiv = document.createElement("div");
            myInnerSpan.classList.add("box");
            ratingDiv.classList.add("rating")
            ratingDiv.innerHTML = `${rating.getProfessorName()}<br><br>
                                Avg Quality: ${rating.getAverageQuality()}<br>
                                Difficulty: ${rating.getDifficulty()}<br>
                                WouldTakeAgain: ${rating.getWouldLikeToTakeAgainRatio()}%`
            myInstructorSpan.appendChild(myInnerSpan);
            myInnerSpan.appendChild(ratingDiv);
        }
        if (!myInstructorSpan.querySelector("span.box2") && numProf == 2) {
            let myInnerSpan = document.createElement("span");
            let ratingDiv = document.createElement("div");
            myInnerSpan.classList.add("box2");
            ratingDiv.classList.add("rating")
            ratingDiv.innerHTML = `${rating.getProfessorName()}<br><br>
                                Avg Quality: ${rating.getAverageQuality()}<br>
                                Difficulty: ${rating.getDifficulty()}<br>
                                WouldTakeAgain: ${rating.getWouldLikeToTakeAgainRatio()}%<br><br>
                                ${rating2.getProfessorName()}<br><br>
                                Avg Quality: ${rating2.getAverageQuality()}<br>
                                Difficulty: ${rating2.getDifficulty()}<br>
                                WouldTakeAgain: ${rating2.getWouldLikeToTakeAgainRatio()}%`
            myInstructorSpan.appendChild(myInnerSpan);
            myInnerSpan.appendChild(ratingDiv);
        }
    }
}

export function render() {
    highlight();
    setInterval(highlight, updateInt);
}

export default {
    render
}