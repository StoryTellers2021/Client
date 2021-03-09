const storyApiUrl = 'http://localhost:8080/api';

var storyApiResponse = {};

/**
 * Requests the story from the server.
 */
function requestStoryAPI() {
    requestJSON(
        storyApiUrl,
        function (responseObject) {
            refreshStory(responseObject['unsolvedStory'], responseObject['solvedStory'], responseObject['solvableWordIndexes'])
        }, function () {
            log('Oh no, the story failed to load!', LOG_FAILURE);
            // TODO: Put the error handling stuff here.
        }, true
    );
}

function showHint() {
    document.getElementById('hint').style.visibility = "visible";
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

addEventListener('DOMContentLoaded', function (event) {
    requestStoryAPI();
});