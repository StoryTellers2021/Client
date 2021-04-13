


//let button = document.createElement("INPUT");
//button.setAttribute("type", "radio");
//button.innerHTML = "sug meg";
//var body = document.getElementsByTagName("body")[0];
//body.appendChild(button);

//find how many stories 
//set that amont to a varible
//make that amouunt of buttons
//user chooses a button
//submits and sends that story to the server or something
for(let i=0; i<5; i++){
    let button = document.createElement("INPUT");
    button.setAttribute("type", "radio");
    button.name = "story";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);

    let text = document.createTextNode("moreeeen din da");
    let space = document.createTextNode(" \n ");
    body.appendChild(text);
    body.appendChild(space);
}




let submit = document.querySelector("button");

submit.onclick = function(){


try{
    let noe = document.querySelector("input[name=story]:checked").value; 
}catch(err){
    alert("Please choose a story");
}
}