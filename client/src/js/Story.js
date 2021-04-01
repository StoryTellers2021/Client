const studentApiUrl = 'http://localhost:8080/api/v1/student';
const teacherApiUrl = 'http://localhost:8080/api/v1/teacher';
var s_id;
var t_id;

let formT = document.getElementById('myformTeacher');
let formS = document.getElementById('myformStudent');


formT.addEventListener('submit', function(e) {
    e.preventDefault();
    requestTeacherAPI();
});

formS.addEventListener('submit', function (e) {
    e.preventDefault();
    requestStudentAPI();
});


function requestStudentAPI() {
    if(document.getElementsByName('student-id')[0].value == null) {
        alert("Please input a student id to login");
    }
    else {
        requestJSON(
            studentApiUrl,
            function (responseObject) {
                if (responseObject['result'] === null) {
                    alert('No student with the id ' + document.getElementsByName('student-id')[0].value);
                } else {
                    s_id = document.getElementsByName('student-id')[0].value;

                    const intro = document.getElementById("login");
                    intro.parentNode.removeChild(intro);
                    document.getElementById("word_go").style.visibility = "visible";

                    document.getElementById("storyContainer").innerHTML = "";
                    document.getElementById("wordContainer").innerHTML = "";

                    refreshStory(responseObject['result']['story']['unsolvedStory'], responseObject['result']['story']['solvedStory'],
                        responseObject['result']['story']['solvableWordIndexes']);
                }
            }, function () {
                log('Oh no, the student data failed to load!', LOG_FAILURE);
                // TODO: Put the error handling stuff here.
            }, false,
            formS
        );
    }
}

function requestTeacherAPI() {
    if(document.getElementsByName('teacher-code')[0].value == null) {
        alert("Please input a teacher id to login");
    }
    else {
        requestJSON(
            teacherApiUrl,
            function (responseObject) {
                if (responseObject['result'] === null) {
                    alert('No teacher with the id ' + document.getElementsByName('teacher-code')[0].value);
                } else {
                    t_id = document.getElementsByName('teacher-code')[0].value;

                    location.replace("./../teacherChoose.html");
                }
            }, function () {
                log('Oh no, the student data failed to load!', LOG_FAILURE);
                // TODO: Put the error handling stuff here.
            }, false,
            formT
        );
    }
}

/**
 * Refreshes the page with the new story.
 * @param {string} unsolvedStory 
 * @param {string} solvedStory 
 * @param {number[]} solvableWordIndexes 
 */
 function refreshStory(unsolvedStory, solvedStory, solvableWordIndexes) {
    const
        words = unsolvedStory.split(' '),
        solvedStoryWords = solvedStory.split(' '),
        wordCount = words.length,
        scrambledWordCount = solvableWordIndexes.length,
        storyContainer = document.getElementById('storyContainer'),
        // clickableWords = new Array(scrambledWordCount),
        unsolvedWords = new Array(scrambledWordCount),
        correctWords = new Array(scrambledWordCount);    
    var scrabledWordIndex = 0, solvableWordIndex = solvableWordIndexes[0];
    for(var wordIndex = 0; wordIndex < wordCount; wordIndex++){
        const word = words[wordIndex], wordElement = document.createElement('span');
        if(wordIndex == solvableWordIndex){
            wordElement.className = 'word solvable unsolved';
            wordElement.setAttribute('data-swi', scrabledWordIndex);
            // clickableWords[scrabledWordIndex] = wordElement;
            unsolvedWords[scrabledWordIndex] = word;
            correctWords[scrabledWordIndex] = solvedStoryWords[solvableWordIndex];
            wordElement.onclick = function(event) {
                const scrabledWordIndex = parseInt(this.getAttribute('data-swi'));
                refreshWord(scrabledWordIndex, this, unsolvedWords[scrabledWordIndex], correctWords[scrabledWordIndex]);
            };
            solvableWordIndex = ++scrabledWordIndex < scrambledWordCount ? solvableWordIndexes[scrabledWordIndex] : -1;
        } else wordElement.className = 'word';
        wordElement.innerText = word;
        storyContainer.appendChild(wordElement);
    }
}

function showTeacher() {
    const teacher = document.getElementById('myformTeacher');
    const student = document.getElementById('myformStudent');

    teacher.style.display = 'block';
    student.style.display = 'none';
}

function showStudent() {
    const teacher = document.getElementById('myformTeacher');
    const student = document.getElementById('myformStudent');

    teacher.style.display = 'none';
    student.style.display = 'block';
}

//TEacher Side HTML references
//All js code from .js
// Ask Joachim
//This is a mess
function teacherSide(){
    location.replace('./../teacherChoose.html');
}

function addStory(){
    location.replace('./../addStory.html');
}

function neemSelectS(){
    location.replace('./../neemSelectS.html');
}

function login(){
    location.replace('./../index.html');
}


//teacherChoose.js
//
function choose(){
    console.log(document.getElementById("1").checked);
    console.log(document.getElementById("2").value);
    if(document.getElementById("1").checked){
       // window.location.href = "neemSelectS.html"
        neemSelectS();
    }else if (document.getElementById("2").checked){
        addStory();
    }else if (document.getElementById("3").checked){
        alert("Game has been started");
    
    }else{

try{
    let noe = document.querySelector("input[name=choose]:checked").value;
    console.log(noe); 
}catch(err){
    alert("Please choose a story");
}
}
}

//neemSelectS.js
//
function selectStory(){
stories = ["story title 1", "story title 2", 'story title 3'];

options = document.createElement('select');
selectContainer = document.getElementById('stories');

options.setAttribute('id', 'story');

for(const s of stories) {
    var x = 1;
    list = document.createElement('option');
    list.setAttribute('value', x);
    list.text = s;
    options.add(list);
    x++;
}

selectContainer.appendChild(options);

function getValue() {
    list = document.getElementById('story');
    console.log(list.options[list.selectedIndex].text);
}

let submit = document.querySelector("button");
submit.onclick = function(){
   
    list = document.getElementById('story');
   let name = list.options[list.selectedIndex].text;
   console.log(list.options[list.selectedIndex].text);
    alert(name + " selected");
}
}
//addStory.js
//

function addStory2(){
    let submit1 = document.getElementById("1");
    let finish1 = document.getElementById("two");
    
    console.log(finish1);
    finish1.style.visibility = "hidden";

 submit1.onclick = function(){
   // console.log(document.getElementById("newStory").value);
    let newStory = document.getElementById("newStory").value;
    let story = document.createTextNode(newStory);
    story.id = "selectedstory";
    
    let t = document.getElementById("selectedstory");
    let y = document.createTextNode(story.textContent);

    t.appendChild(y);

    let newH = document.getElementById("newMessage");
    let text = document.createTextNode("Select the words you want to scramble");
    newH.appendChild(text);

    submit1.style.visibility = 'hidden';
    finish1.style.visibility = 'visible';


    selectWords();

}

function selectWords(){
storyContainer = document.getElementById('selectedstory');

console.log(storyContainer.value)

story = storyContainer.innerHTML;
story = story.trim();
story_words = story.split(" ");

storyContainer.innerHTML = '';

scarmbleWordIndex = []

for(var i = 0; i < story_words.length; i++) {
    wordElement = document.createElement('span');
    wordElement.className = 'clickable';

    const word = story_words[i];
      
    wordElement.innerHTML = word;

    
    wordElement.onclick = function() {
        if (this.className === 'clickable') {
            scarmbleWordIndex.push(story_words.indexOf(this.innerHTML));
            this.className = 'unclickable';
        }
        else {
            const num = story_words.indexOf(this.innerHTML)
            const index = scarmbleWordIndex.indexOf(num);
            scarmbleWordIndex.splice(index, 1);
            this.className = 'clickable';
        }
        console.log(scarmbleWordIndex);

    };

    storyContainer.appendChild(wordElement);
}

}

finish1.onclick =  function(){
    alert("Story and words to scramble have been added to game");
}
}


//addEventListener('DOMContentLoaded', function (event) {
//    requestStudentAPI();
//});