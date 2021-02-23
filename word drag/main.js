// This is to get the number of boxes to make.
var word = getQuery();
var num = word.length;
var tochange = "";
var changed = "";

function getQuery() {
    var query = window.location.search.substring(1);
    console.log(query);
    
    return query;
}

// Add a specific number of boxes in the html file.
for(var i = 0; i<num; i++) {
    document.body.innerHTML += '<div class="box"></div>';
}


const empties = document.querySelectorAll('.box');

for(var i =0; i < empties.length; i++) {
    empties[i].innerHTML += '<div class = "letters" draggable="true"></div>';
    empties[i].querySelector('.letters').innerHTML += word[i];
}


const letters = document.querySelectorAll('.letters');

for(const l of letters) {
    l.addEventListener('dragenter', dragEnter);
    l.addEventListener('dragover', dragOver);
    l.addEventListener('dragleave', dragLeave);
    l.addEventListener('drop', dragDrop);
    l.addEventListener('dragstart', dragStart);
    l.addEventListener('dragend', dragEnd);
}

function dragStart() {
    tochange = this.innerHTML;
}

function dragEnd() {
    this.innerHTML = changed;
}

function dragEnter(e) {
    e.preventDefault();
    this.parentNode.className += ' hovered';
}

function dragOver(e) {
    e.preventDefault();
}

function dragLeave() {
    this.parentNode.className = 'box';
}

function dragDrop() {
    this.parentNode.className = 'box';
    changed = this.innerHTML;
    this.innerHTML = tochange;
}
