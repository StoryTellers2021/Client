let submit = document.getElementById("1");
let finish = document.getElementById("2");
finish.style.visibility = "hidden"

submit.onclick = function(){
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

    submit.style.visibility = 'hidden';
    finish.style.visibility = 'visible';

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

finish.onclick =  function(){
    alert("Story and words to scramble have been added to game");
}