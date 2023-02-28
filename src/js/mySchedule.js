
const updateInt = 5000;

function highlight(){
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
        if (!myInstructorSpan.querySelector("span.box")) {
            let myInnerSpan = document.createElement("span");
            myInnerSpan.classList.add("box");
            myInnerSpan.innerHTML = "something here..?";
            myInstructorSpan.appendChild(myInnerSpan);
        }
    }
}
function render() {
    highlight();
    setInterval(highlight, updateInt);
}

export default {
    render
}