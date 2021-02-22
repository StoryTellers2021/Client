// This is to get the number of boxes to make.
var word = getQuery();
var num = word.length;

function getQuery() {
    var query = window.location.search.substring(1);
    console.log(query);
    
    return query;
}

// Add a specific number of boxes in the html file.
for(var i = 0; i<num; i++) {
    document.body.innerHTML += '<div class="box"></div>';
}

//document.body.innerHTML += '<div class = "letters" draggable = "true"></div>';
const empties = document.querySelectorAll('.box');

empties[0].innerHTML += '<div class = "letters" draggable="true"></div>';


const letters = document.querySelector('.letters');

letters.addEventListener('dragstart', dragStart);
letters.addEventListener('dragend', dragEnd);


for(const empty of empties) {
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('drop', dragDrop);
}

function dragStart() {
    console.log("dragStarted!!");
}

function dragEnd() {
    console.log('Ended!!');
}

function dragEnter(e) {
    console.log("entered!!");
    e.preventDefault();
    this.className += ' hovered'
}

function dragOver(e) {
    e.preventDefault();
}

function dragLeave() {
    console.log("left!!");
    this.className = 'box';
}

function dragDrop() {
    this.className = 'box';
    this.append(letters);
}
