let submit = document.querySelector("button");

submit.onclick = function(){
    console.log(document.getElementById("1").checked);
    console.log(document.getElementById("2").value);
    if(document.getElementById("1").checked){
        window.location.href = "selectStory.html"
    }else if (document.getElementById("2").checked){
        window.location.href = "addStory.html"
    }else if (document.getElementById("3").checked){
        alert("Game has been started");
    
    }else{

try{
    let noe = document.querySelector("input[name=choose]:checked").value;
    console.log(noe); 
}catch(err){
    alert("Please choose a story");
}
}
}