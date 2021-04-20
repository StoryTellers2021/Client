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
        console.log(scarmbleWordIndex);

    };

    storyContainer.appendChild(wordElement);
}

