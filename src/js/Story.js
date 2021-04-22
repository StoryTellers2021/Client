const intro = document.getElementById('intro');
if(intro) {
    fixSpelling();
}

function displayLogin(){
    document.getElementById("hidden").style.display = "contents";
    let element= document.getElementById("intro");
    element.remove();
}

function fixSpelling(){
    let title = document.getElementsByClassName("one")[0];
    let change = document.getElementById("change");

    title.addEventListener("animationend", function() {
        document.getElementById("1").innerHTML = "W";
        document.getElementById("1").style.color = "#4CAF50";
        setTimeout(() => { document.getElementById("2").innerHTML = "I";
            document.getElementById("2").style.color = "#4CAF50"; }, 250);
        setTimeout(() => { document.getElementById("3").innerHTML = "Z";
            document.getElementById("3").style.color = "#4CAF50"; }, 500);
    });
}

const studentApiUrl = 'http://localhost:8080/api/v1/student';
const teacherApiUrl = 'http://localhost:8080/api/v1/teacher';

let formT = document.getElementById('myformTeacher');
let formS = document.getElementById('myformStudent');

var storyIndex;


if (formT) {
    formT.addEventListener('submit', function(e) {
        e.preventDefault();
        requestTeacherAPI();
    });
}

if (formS) {
    formS.addEventListener('submit', function (e) {
        e.preventDefault();
        requestStudentAPI();
    });
}

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
                    const schoolStudentId = document.getElementsByName('student-id')[0].value;
                    setCookie("sid", schoolStudentId, 1);
                    //setCookie("storyindex", responseObject['result']['storyIndex'],1);
                    //setCookie('unsolvedstory', responseObject['result']['story']['unsolvedStory'],1);
                    //setCookie("solvedstory", responseObject['result']['story']['solvedStory'],1);
                    //setCookie("solvablewordindex", responseObject['result']['story']['solvableWordIndexes'],1);
                    //setCookie("solvedindex", responseObject['result']['solvedWords'],1);
                    //setCookie("gamestarted", responseObject['result']['gameStarted'], 1);
                    //setCookie("gameEnded", responseObject['result']['gameEnded'],1);
                    //setCookie("score", responseObject['result']['score'],1);

                    const intro = document.getElementById("login");
                    intro.style.display = 'none';
                    const title = document.getElementById("title");
                    title.style.display = 'none';

                    //window.location.replace('./../story.html');

                    document.getElementById("storyContainer").innerHTML = "";
                    document.getElementById("wordContainer").innerHTML = "";

                    if (responseObject['result']['gameStarted'] == false) {
                        document.getElementById("storyContainer").innerHTML = "Please wait fot the teacher to start the game!";
                        document.getElementById('ref').style.display = 'block';
                    }
                    else if (responseObject['result']['gameEnded'] == true) {
                        document.getElementById("storyContainer").innerHTML = "The game has ended. Please consult the teacher!"
                        document.getElementById('ref').style.display = 'block';
                    }
                    else {
                        document.getElementById("score").innerText = "score: " + responseObject['result']['score'];
                        document.getElementById('name').innerText = responseObject['result']['firstName'] + " " + responseObject['result']['lastName'];

                        refreshStory(responseObject['result']['storyIndex'], responseObject['result']['story']['unsolvedStory'], responseObject['result']['story']['solvedStory'],
                            responseObject['result']['story']['solvableWordIndexes'], responseObject['result']['solvedWords']);

                        document.getElementById('studentSolutionId').value = schoolStudentId;

                        if (responseObject['result']['solvedWords'].length == responseObject['result']['story']['solvableWordIndexes'].length) {
                           alert("Congratulations!! You have completed all the stories in the game");
                            //TODO: Direct to a webpage that shows the students score with words that were solved correctly vs incorrectly
                        }
                    }

                }
            }, function () {
                log('Oh no, the student data failed to load!', LOG_FAILURE);
                // TODO: Put the error handling stuff here.
            }, false,
            formS
        );
    }
}

/**function loadStudent() {
    document.getElementById("storyContainer").innerHTML = "";
    document.getElementById("wordContainer").innerHTML = "";

    console.log(getCookie('gamestarted'));
    console.log(getCookie('gameEnded'));
    if (getCookie('gamestarted') == 'false') {
        document.getElementById("storyContainer").innerHTML = "Please wait fot the teacher to start the game!";
    }
    else if (getCookie('gameEnded') == 'true') {
        document.getElementById("storyContainer").innerHTML = "The game has ended. Please consult the teacher!";
     }
    else {

        document.getElementById("score").innerText = "score: " + getCookie('score');

         refreshStory(getCookie('storyindex'), getCookie('unsolvedstory'), getCookie('solvedstory'),
            getCookie('solvablewordindex'), getCookie('solvedindex'));

        document.getElementById('studentSolutionId').value = schoolStudentId;
    }
}*/

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
                    setCookie("tid",document.getElementsByName('teacher-code')[0].value, 1);
                    //document.cookie = document.getElementsByName('teacher-code')[0].value;

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
function refreshStory(newStoryIndex, unsolvedStory, solvedStory, solvableWordIndexes, solvedIndex) {
    if(newStoryIndex == storyIndex)
        return;
    storyIndex = newStoryIndex;
    document.getElementById("storyContainer").innerHTML = "";
    document.getElementById("wordContainer").innerHTML = "";
    const
        words = unsolvedStory.split(' '),
        solvedStoryWords = solvedStory.split(' '),
        wordCount = words.length,
        scrambledWordCount = solvableWordIndexes.length,
        storyContainer = document.getElementById('storyContainer');

    var scrabledWordIndex = 0, solvableWordIndex = solvableWordIndexes[0];

    for(var wordIndex = 0; wordIndex < wordCount; wordIndex++){
        const wordStr = words[wordIndex], wordElement = document.createElement('span');
        if(wordIndex == solvableWordIndex){
            new Word(wordElement, scrabledWordIndex, wordStr, solvedStoryWords[solvableWordIndex], solvedIndex.indexOf(scrabledWordIndex) > -1);
            solvableWordIndex = ++scrabledWordIndex < scrambledWordCount ? solvableWordIndexes[scrabledWordIndex] : -1;
        } else wordElement.className = 'word';
        if (wordElement.className == 'word') {
            wordElement.innerText = solvedStoryWords[wordIndex];
        }
        wordElement.innerText += " ";
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
    location.replace('./../SelectWords.html');
}

function login(){
    location.replace('./../index.html');
}

function addStudent() {
    location.replace('./../addStudent.html');
}

function progressClick() {
    location.replace('./../studentProgress.html');
}

function startGame() {
    const tc = document.getElementById('tc');
    tc[0].value = getCookie('tid');
    requestJSON(
        "http://localhost:8080/api/v1/teacher/game/start",
        function(responseObject) {
            alert("Game has been started")
        },
        function () {
            alert("The game could not be started!")
        },
        false,
        tc
    )
}

function endGame() {
    const tc = document.getElementById('tc');
    tc[0].value = getCookie('tid');
    requestJSON(
        "http://localhost:8080/api/v1/teacher/game/end",
        function(responseObject) {
            alert("Game has been ended")
        },
        function () {
            alert("The game could not be ended!")
        },
        false,
        tc
    )
}

/**
 * Show the story that is being edited.
 * @constructor
 */
function OptionsExistingStory() {
    const get_story = document.getElementById("get_stories");
    get_story[0].value = getCookie("tid");
    requestJSON(
        "http://localhost:8080/api/v1/teacher/game",
        function (responseObject) {
            const s_list = responseObject['result']['stories'];
            let index = 0;
            showEditingStory();

            function showEditingStory() {
                setCookie("index",index,1);
                const storyContainer = document.getElementById("story");
                storyContainer.innerText = s_list[index]['solvedStory'];

                story = storyContainer.innerHTML;
                story = story.trim();
                story_words = story.split(" ");

                storyContainer.innerHTML = '';

                scarmbleWordIndex = s_list[index]['solvableWordIndexes'];
                console.log(scarmbleWordIndex);

                for(var i = 0; i < story_words.length; i++) {
                    wordElement = document.createElement('span');
                    if (scarmbleWordIndex.includes(i)) {
                        wordElement.className = 'unclickable';
                    } else {
                        wordElement.className = 'clickable';
                    }
                    const word = story_words[i];

                    wordElement.innerHTML = word;

                    storyContainer.appendChild(wordElement);
                }


                document.getElementById("nextStory").onclick = function () {
                    if (index == s_list.length-1) {
                        alert("This is the last story on the game list.");
                    }
                    else {
                        index ++;
                        showEditingStory();
                    }
                }

                document.getElementById("previousStory").onclick = function () {
                    if (index == 0) {
                        alert("This is the fisrt story on the game list.");
                    }
                    else {
                        index --;
                        showEditingStory();
                    }
                }
            }
        },
        function () {
            alert("Story could not loaded at this time.");
        },
        false,
        get_story
    )

}

/**
 * Select words from story
 */
function SelectWordsFromStory() {
    const get_story = document.getElementById("get_stories");
    get_story[0].value = getCookie("tid");

    requestJSON(
        "http://localhost:8080/api/v1/teacher/game",
        function (responseObject) {
            const s_list = responseObject['result']['stories'];
            let index = getCookie("index");
            showStory();
            function showStory() {
                const storyContainer = document.getElementById("scrambleEdit");
                storyContainer.innerText = s_list[index]['solvedStory'];


                story = storyContainer.innerHTML;
                story = story.trim();
                story_words = story.split(" ");

                storyContainer.innerHTML = '';

                scarmbleWordIndex = s_list[index]['solvableWordIndexes'];
                console.log(scarmbleWordIndex);

                for(var i = 0; i < story_words.length; i++) {
                    wordElement = document.createElement('span');
                    if (scarmbleWordIndex.includes(i)) {
                        wordElement.className = 'unclickable';
                    }
                    else {
                        wordElement.className = 'clickable';
                    }
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
            //TODO: Make a post request

        },
        function () {

        },
        false,
        get_story
    )

}

/**
 * Edit the existing story
 * @constructor
 */
function EditExistingStory() {
    let submit1 = document.getElementById("1");
    let finish1 = document.getElementById("two");

    finish1.style.visibility = "hidden";

    let teacherCodeForm = document.getElementById("EditStory");
    console.log(teacherCodeForm);
    teacherCodeForm[0].value = getCookie("tid");

    requestJSON(
        "http://localhost:8080/api/v1/teacher/game",
        function(responseObject) {
            let newStory = document.getElementById("newStory");
            newStory.value = responseObject['result']['stories'][getCookie("index")]['solvedStory'];
            console.log(newStory.value);

            submit1.onclick = function(){
                let newStory = document.getElementById("newStory").value.trim();
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

            function selectWords() {
                storyContainer = document.getElementById('selectedstory');

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
                    };

                    storyContainer.appendChild(wordElement);
                }
            }
            //TODO: Make a post request
        },
        function(){
            alert("The story could not be loaded at this moment.");
        },false,
        teacherCodeForm
    )
}

//addStory.js
//
function addStory2(){
    let submit1 = document.getElementById("1");
    let finish1 = document.getElementById("two");

    finish1.style.visibility = "hidden";

    submit1.onclick = function(){
        //console.log(document.getElementById("newStory").value);
        let newStory = document.getElementById("newStory").value.trim();
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

    function selectWords() {
        storyContainer = document.getElementById('selectedstory');

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
            };

            storyContainer.appendChild(wordElement);
        }


    }

    /**
     * This sends the data to the server with the new story to add.
     */
    finish1.onclick =  function(){
        console.log(scarmbleWordIndex);
        console.log(story);

        const f_add = document.getElementById('add_story_form');

        document.getElementById('teacher_add_id').value = getCookie("tid");
        document.getElementById('story_add').value = story;
        document.getElementById('story_add_index').value = scarmbleWordIndex.join(',');

        requestJSON(
            "http://localhost:8080/api/v1/teacher/add-story",
            function (responseObject) {
                alert("The story has been successfully added");
                addStory();
            },
            function(){
                alert("Sorry the story could not be added.");
            }, false,
            f_add
        );
    }
}

/**
 * Resets student progress
 */
function reset(){
    if (confirm('Are yo sure you want to reset the game? \nAll student progress will be lost')) {
        const tc = document.getElementById('tc');
    tc[0].value = getCookie('tid');
    requestJSON(
        "http://localhost:8080/api/v1/teacher/game/reset",
        function(responseObject) {
            alert("Game has been reset");
        },
        function () {
            alert("The game could not be reset!")
        },
        false,
        tc
    )

      } else {
        // Do nothing!
        console.log('Thing was not saved to the database.');
      }
}

/**
 * function to clear the cookie once the teacher logs out.
 */
function teacherlogout() {
    clearCookie();
    login();
}

/**
 * Function to get data of students for a particular teacher and show them as a table data.
 */
function showstudentProgress() {
    const f_studentProgress = document.getElementById("get_students");
    document.getElementById("studentProgressTeacherCode").value = getCookie("tid");
    requestJSON(
        'http://localhost:8080/api/v1/teacher/game',
        function(responseObject) {
            const game = responseObject['result']['stories'].length;
            requestJSON(
                "http://localhost:8080/api/v1/teacher/students",
                function(responseObject) {
                    let data = [];

                    for (let i = 0; i < responseObject['result'].length; i++) {
                        const g_prog = parseInt(responseObject['result'][i]['storyIndex'])*100/game;

                        const div = document.createElement('div');
                        const span = document.createElement('div');
                        div.className = "progress_div";
                        span.className = "progress_span"

                        span.style.width = g_prog + "%";
                        div.appendChild(span);

                        const div2 = document.createElement('div');
                        const span2 = document.createElement('div');
                        div2.className = "progress_div";
                        span2.className = "progress_span";

                        span2.style.width = parseInt(responseObject['result'][i]['solvedWords'].length) *
                            100/ parseInt(responseObject['result'][i]['story']['solvableWordIndexes'].length) + "%";
                        div2.appendChild(span2);
                        console.log(span2);

                        data.push({
                            FirstName: responseObject['result'][i]['firstName'],
                            LastName: responseObject['result'][i]['lastName'],
                            StudentId: responseObject['result'][i]['studentId'],
                            Score: responseObject['result'][i]['score'],
                            CurrentStory: responseObject['result'][i]['storyIndex'],
                            CurrentStoryProgress: div2,
                            TotalGameProgress: div
                        });
                    }

                    let table = document.querySelector("table");
                    let d = Object.keys(data[0]);
                    MakeTable(table, data);
                    MakeTableHead(table, d);
                },
                function () {

                }, false,
                f_studentProgress
            )
        },
        function() {

        }, false,
        f_studentProgress
    )
}

/**
 * Function to make the table head.
 * @param {HTML table} table
 * @param {String array} data
 * @constructor
 */
function MakeTableHead(table, data) {
    let th = table.createTHead();
    let r = th.insertRow();
    for (let key of data) {
        let t = document.createElement("th");
        let text = document.createTextNode(key);
        t.appendChild(text);
        r.appendChild(t);
    }
}

/**
 * Function to make the table
 * @param {HTML Table} table
 * @param {dictionary} data
 * @constructor
 */
function MakeTable(table, data) {
    for (let e of data){
        let r = table.insertRow();
        for (let key in e) {
            let cell = r.insertCell();
            let text = document.createTextNode(e[key]);
            if (key == "TotalGameProgress" || key == "CurrentStoryProgress") {
                cell.appendChild(e[key]);
            }
            else {
                cell.appendChild(text);
            }
        }
    }
}


/**
 * Function that adds the student
 */
function addNewStudent() {
    const add_student_form = document.getElementById("addStudent");
    add_student_form[0].value = getCookie("tid");
    requestJSON(
        "http://localhost:8080/api/v1/teacher/add-student",
        function(responseObject) {
            let text = add_student_form[1].value + " " + add_student_form[2].value;
            alert(text + " has been added to your game");
            teacherSide();
        },
        function() {
            alert("The student could not be added.");
            console.log(add_student_form[0]);
            console.log(add_student_form[1]);
            console.log(add_student_form[2]);
            console.log(add_student_form[3]);
        }, false,
        add_student_form
    )
}

/**
 * Add cookie with a specific name
 * @param name
 * @param value
 * @param daysToLive
 */
function setCookie(name, value, daysToLive) {
    // Encode value in order to escape semicolons, commas, and whitespace
    var cookie = name + "=" + encodeURIComponent(value);

    if(typeof daysToLive === "number") {
        /* Sets the max-age attribute so that the cookie expires
        after the specified number of days */
        cookie += "; max-age=" + (daysToLive*24*60*60);

        document.cookie = cookie;
    }
}

/**
 * Get the cookie of that name
 * @param name
 * @returns {string|null}
 */
function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if not found
    return null;
}

/**
 * Clear all cookies.
 */
function clearCookie() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function refresh() {
    const f = document.getElementById('refreshing');
    f[0].value = getCookie("sid");
    requestJSON(
        "http://localhost:8080/api/v1/student",
        function (responseObject) {
            document.getElementById("storyContainer").innerHTML = "";
            document.getElementById("wordContainer").innerHTML = "";

            if (responseObject['result']['gameStarted'] == false) {
                document.getElementById("storyContainer").innerHTML = "Please wait fot the teacher to start the game!";
            }
            else if (responseObject['result']['gameEnded'] == true) {
                document.getElementById("storyContainer").innerHTML = "The game has ended. Please consult the teacher!"
            }
            else {
                document.getElementById("ref").style.display = 'none';
                document.getElementById("score").innerText = "score: " + responseObject['result']['score'];

                refreshStory(responseObject['result']['storyIndex'], responseObject['result']['story']['unsolvedStory'], responseObject['result']['story']['solvedStory'],
                    responseObject['result']['story']['solvableWordIndexes'], responseObject['result']['solvedWords']);

                document.getElementById('studentSolutionId').value = getCookie('sid');

                if (responseObject['result']['solvedWords'].length == responseObject['result']['story']['solvableWordIndexes'].length) {
                    alert("Congratulations!! You have completed all the stories in the game");
                    //TODO: Direct to a webpage that shows the students score with words that were solved correctly vs incorrectly
                }
            }
        },
        function () {

        },
        false,
        f
    )
}