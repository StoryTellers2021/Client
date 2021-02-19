const el = document.querySelector(".item");

el.addEventListener("mousedown", mousedown);

function mousedown(e) {
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    let px = e.clientX;
    let py = e.clientY;

    function mousemove(e) {
        let newx = px - e.clientX;
        let newy = py - e.clientY;
        
        const rect = el.getBoundingClientRect();
        
        el.style.left = rect.left - newx + "px";
        el.style.top = rect.top - newy + "px";

        px = e.clientX;
        py = e.clientY;
    }

    function mouseup() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}