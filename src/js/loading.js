import Message from "./models/Message.js";
import { parseRmpSearchResultHtml, rmpSearchURL } from "./web/rateMyProfessor.js";
import { sfuProgramPageUrls, sfuCoursesInProgram, getCurrentSemester } from "./web/sfu.js";
import { promiseWindow, PROMISE_WINDOW_SIZE, waitFor } from "./web/utils.js";

let messageQueue=[];
window.addEventListener("message", event => {
  const messageFromParent = event.data;
  if (event.data.key === "yieldFetchOnServiceWorker_response") messageQueue.push(messageFromParent);
});

function makeHandshake() {
  window.parent.postMessage(new Message("sandbox_message", "handshake", null), '*');
}

function sendCourseInfo(data) {
  window.parent.postMessage(new Message("sandbox_message", "courseInfo", data), '*');
}

function sendRatingInfo(data) {
  window.parent.postMessage(new Message("sandbox_message", "professorRatingInfo", data), '*');
}

function sendLoadingCompletion() {
  window.parent.postMessage(new Message("sandbox_message", "loadingCompletion", null), '*');
}

/**
 * This is to avoid CORS error
 */
function sendYieldFetchOnServiceWorker(identifier, url) {
  window.parent.postMessage(new Message("sandbox_message", "yieldFetchOnServiceWorker", {
    identifier,
    url
  }), '*');
}

function filterOutCourseWithoutSection(courses) {
  const courseWithSection = [];
  courses.forEach(course => {
      if (course.sections.length > 0)
          courseWithSection.push(course);
  });
  return courseWithSection;
}

function uniqueProfessorNames(courses) {
  const uniqueNames = [];
  courses.forEach(course => course.getSections().forEach(section => section.getProfessors().forEach(professorName => {
    if (!uniqueNames.includes(professorName))
      uniqueNames.push(professorName);
  })));
  return uniqueNames;
}

async function findProfessorRatings(professorName) {
  const requestUrl = rmpSearchURL(professorName);

  let messageEvent;
  sendYieldFetchOnServiceWorker(professorName, requestUrl);
  await waitFor(() => {
    let myMessage = messageQueue.filter(m => m.message.identifier === professorName);
    messageEvent = myMessage[0];
    return messageQueue.length > 0 && myMessage.length > 0;
  });

  const html = messageEvent.message.result;
  const professorRatings = parseRmpSearchResultHtml(html);
  return professorRatings;
}

function displayCurrentSemester() {
  let currentSemEle = document.getElementById("current_semester");
  const [semester, year] = getCurrentSemester();
  currentSemEle.innerHTML = `${semester.toUpperCase()} ${year}`;
}

function displayNumericProgress(curr, max) {
  let progressTextEle = document.getElementById("progressNumeric");
  progressTextEle.innerHTML = `(${curr}/${max})`;
}

function displayProgressHeaderText(text) {
  let progressHeaderTextEle = document.getElementById("progressHeaderText");
  progressHeaderTextEle.innerHTML = text;
}

function displayProgressText(text) {
  let progressTextEle = document.getElementById("progressText");
  progressTextEle.innerHTML = text;
}

function displayCompletion() {
  let eleToHide = document.getElementById("hide_on_finish");
  let eleToShow = document.getElementById("show_on_finish");
  eleToHide.style.display = "none";
  eleToShow.style.display = "flex";
}

class BackgroundTask{
  static isRunning = false;

  static async initiate() {
    if (BackgroundTask.isRunning) return;

    let progress = 1;
    let courses = [];

    const programUrls = await sfuProgramPageUrls();
    displayCurrentSemester();
    displayNumericProgress(progress, programUrls.length);
/**
 * Collect SFU course information from Academic Calendar
 */
    displayProgressHeaderText("Loading course information from SFU Academic Calendar...");
    for (let url of programUrls) {
      const coursesInProgram = await sfuCoursesInProgram(url);
      courses = [...courses, ...coursesInProgram];
      displayProgressText(url);
      displayNumericProgress(progress+1, programUrls.length);
      progress += 1;
    }
    courses = filterOutCourseWithoutSection(courses);
    sendCourseInfo(courses);

/**
 * Collect RateMyProfessor Rating information
 */
    const professorNames = uniqueProfessorNames(courses);
    const professorRatingDic = {};
    progress = 1;
    displayProgressHeaderText("Loading RateMyProfessor.com professor ratings...");
    displayNumericProgress(progress, professorNames.length);
    displayProgressText('');

    await promiseWindow(
      PROMISE_WINDOW_SIZE.MEDIUM,
      professorNames,
      (professorName) => new Promise((resolve, _) => {
        findProfessorRatings(professorName).then(ratings => {
          if (ratings.length > 0)
            professorRatingDic[professorName] = ratings[0];
          displayNumericProgress(progress+1, professorNames.length);
          progress += 1;
          resolve();
        })
      }));
    sendRatingInfo(professorRatingDic);

    displayCompletion();
    sendLoadingCompletion();
    BackgroundTask.isRunning = false;
  }
}

makeHandshake();

BackgroundTask.initiate();