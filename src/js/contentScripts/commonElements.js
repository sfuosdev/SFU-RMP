export function createTooltip() {
    const tooltipEle = document.createElement("span");
    tooltipEle.classList.add("rating_box_wrapper");
    return tooltipEle;
}

export function drawProfessorRatingsInTooltip(tooltipEle, professorRatings) {
    professorRatings.forEach(rating => {
        const itemWrapper = document.createElement("div");
        itemWrapper.classList.add("rating_item_wrapper");
        
        const header = document.createElement("h3");
        const avgQuality = document.createElement("p");
        const difficulty = document.createElement("p");
        const wouldTakeAgain = document.createElement("p");

        header.innerHTML = rating.getProfessorName();
        avgQuality.innerHTML = `Avg Quality: ${rating.getAverageQuality() ? `<b>${rating.getAverageQuality().toFixed(1)}</b>/5` : "N/A"}`;
        difficulty.innerHTML = `Difficulty: ${rating.getDifficulty() ? `<b>${rating.getDifficulty().toFixed(1)}</b>/5` : "N/A"}`;
        wouldTakeAgain.innerHTML = `WouldTakeAgain: ${rating.getWouldLikeToTakeAgainRatio() ? `<b>${parseFloat(rating.getWouldLikeToTakeAgainRatio()*100).toFixed(0)}%</b>` : "N/A"}`;
    
        itemWrapper.appendChild(header);
        itemWrapper.appendChild(document.createElement("hr"));
        itemWrapper.appendChild(avgQuality);
        itemWrapper.appendChild(difficulty);
        itemWrapper.appendChild(wouldTakeAgain);
        tooltipEle.prepend(itemWrapper);
    });
}

export function colorInstructorName (instructorNameElement) {
    instructorNameElement.classList.add("rmp_instructor_wrapper");
    instructorNameElement.style.color = "#3498db";
}

export function containsRmpWrapper (element) {
    return element.classList.contains("rmp_instructor_wrapper");
}