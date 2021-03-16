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