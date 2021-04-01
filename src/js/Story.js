const studentApiUrl = 'http://localhost:8080/api/v1/student';
const form = document.getElementById('myform');
var s_id;

form.addEventListener('submit', function(e) {
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

                    location.replace("src/story.html")
                    refreshStory(responseObject['result']['story']['unsolvedStory'], responseObject['result']['story']['solvedStory'],
                        responseObject['result']['story']['solvableWordIndexes']);
                }
            }, function () {
                log('Oh no, the student data failed to load!', LOG_FAILURE);
                // TODO: Put the error handling stuff here.
            }, false,
            form
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

//addEventListener('DOMContentLoaded', function (event) {
//    requestStudentAPI();
//});