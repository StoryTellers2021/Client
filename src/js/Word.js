
/**
 * Refreshes the page with the new word to unscramble.
 * @param {number} scrabledWordIndex 
 * @param {HTMLElement} clickableWord 
 * @param {string} unsolvedWord 
 * @param {string} correctWord 
 */

var word_index;

function refreshWord(scrabledWordIndex, clickableWord, unsolvedWord, correctWord) {
    let cw = correctWord;
    const word = unsolvedWord, wordContainer = document.getElementById('wordContainer');
    let num = word.length;
    word_index = scrabledWordIndex;

    console.log(scrabledWordIndex);
    console.log(clickableWord);
    

    let button = document.getElementById('hint');
    button.style.visibility = 'hidden';

    setTimeout(function () { showHint() }, 10000);

    button.addEventListener('click', function () {
        getHint(cw);
    }, false);

    wordContainer.innerHTML = '';
    // Add a specific number of boxes in the html file.
    for (var i = 0; i < num; i++) {
        wordContainer.innerHTML += '<div class="box"></div>';
    }


    const empties = document.querySelectorAll('.box');

    for (var i = 0; i < empties.length; i++) {
        empties[i].innerHTML += '<div class = "letters" draggable="true"></div>';
        empties[i].querySelector('.letters').innerHTML += word[i];
    }


    const letters = document.querySelectorAll('.letters');

    for (const l of letters) {
        l.addEventListener('dragenter', dragEnter);
        l.addEventListener('dragover', dragOver);
        l.addEventListener('dragleave', dragLeave);
        l.addEventListener('drop', dragDrop);
        l.addEventListener('dragstart', dragStart);
        l.addEventListener('dragend', dragEnd);
    }
}

var tochange = "";
var changed = "";

// function to check if the word is correct or not.
function check() {
    var temp = "";
    const letters = document.querySelectorAll('.letters');
    for(const l of letters) {
        temp += l.innerHTML;
    }

    return temp;

}

// This is to get what the query gets so that we can make boxes accordingly.
function getQuery() {
    var query = window.location.search.substring(1);
    console.log(query);
    
    return query;
}

// function that activates when mouse clicks.
function dragStart() {
    tochange = this.innerHTML;
}

// function that activates when mouse is let go.
function dragEnd() {
    if("" != changed) {
        this.innerHTML = changed;
    }
    tochange = "";
    changed = "";
}

// function that activates when it enters anothers box.
function dragEnter(e) {
    e.preventDefault();
    this.parentNode.className += ' hovered';
}

// we don't need this one.
function dragOver(e) {
    e.preventDefault();
}

// function that activates when we leave a ceratin box.
function dragLeave() {
    this.parentNode.className = 'box';
}

// function that activates when we drop the drag so this 
// happens before dragEnd happens but both from mouseclick up.
function dragDrop() {
    this.parentNode.className = 'box';
    changed = this.innerHTML;
    this.innerHTML = tochange;
}

function showHint() {
    document.getElementById('hint').style.visibility = "visible";
}

/**
 * Get hint reshuffles the words with certain number of correct words.
 * @param {string} cw
 */
function getHint(cw) {
    const letters = document.querySelectorAll('.letters'), word = cw;
    let num = word.length;

    for (var i = 0; i < Math.ceil(num/3); i++) {
        for (const l of letters) {
            if (l.textContent === word[i]) {
                l.textContent = letters[i].textContent;
                letters[i].textContent = word[i];
                letters[i].className = 'lettershint';

                letters[i].setAttribute('draggable', false);
                letters[i].removeEventListener('dragstart', dragStart);
                letters[i].removeEventListener('dragleave', dragLeave);
                letters[i].removeEventListener('dragenter', dragEnter);
                letters[i].removeEventListener('dragover', dragOver);
                letters[i].removeEventListener('drop', dragDrop);
                letters[i].removeEventListener('dragend', dragEnd);
            }
        }
    }
}

/**
 * Function to validate the student word after submit has been pressed
 */
function validateStudentWord() {
    // document.body.innerHTML += "<form id='f' style='visibility: hidden'></form>";
    const f = document.getElementById('studentSolution');

    // f.innerHTML += "<input type='hidden' name='student-id'/>";
    // f.innerHTML += "<input type='hidden' name='word-index'/>";
    // f.innerHTML += "<input type='hidden' name='word-solution'/>";

    let word_solution = check();

    document.getElementById('studentSolutionId').value = document.cookie;
    document.getElementById('studentSolutionWordIndex').value = word_index;
    document.getElementById('studentSolutionWordSolution').value = word_solution;


    //const f_real = f;
    requestJSON(
        studentApiUrl,
        function (responseObject) {
            if(responseObject['result'] == null){
                console.log(responseObject);
            }else{
                document.getElementById("storyContainer").innerHTML = "";
                document.getElementById("wordContainer").innerHTML = "";

                refreshStory(responseObject['result']['story']['unsolvedStory'], responseObject['result']['story']['solvedStory'],
                responseObject['result']['story']['solvableWordIndexes'], responseObject['result']['solvedWords']);

            }
        }, function () {

            log('Oh no, the student data failed to load!', LOG_FAILURE);
        }, false,
        f
    );
}
