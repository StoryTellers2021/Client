
/**
 * Refreshes the page with the new word to unscramble.
 * @param {number} scrabledWordIndex 
 * @param {HTMLElement} clickableWord 
 * @param {string} unsolvedWord 
 * @param {string} correctWord 
 */
function refreshWord(scrabledWordIndex, clickableWord, unsolvedWord, correctWord) {
    const word = unsolvedWord, wordContainer = document.getElementById('wordContainer');
    var num = word.length;

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

/*setTimeout(function() {
    document.body.innerHTML += "<button>hint</button>";
}, 10000);*/

// function to check if the word is correct or not.
function check() {
    var temp = ""
    for(const l of letters) {
        temp += l.innerHTML;
    }

    if (temp === "hello") {
        console.log("Correct");
    }
    else {
        console.log("Close!");
    }
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
