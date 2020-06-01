const header_and_navigatorBlock_height = 500;
const bottomOffset = 20;
const animationDistance = 125;
const animationTime = 50;
const timeStep = 1;

const backToTopButton = document.getElementById("back_to_top_block");
let shown = document.body.scrollTop > header_and_navigatorBlock_height || document.documentElement.scrollTop > header_and_navigatorBlock_height;
if(shown) {
    backToTopButton.style.display = "flex";
}

const moveBackToTopButton = (display) => {
    backToTopButton.style.display = display;
    if (display === "flex") {
        if(shown) {
            return;
        }
        var pos = (display === "flex" ? bottomOffset-animationDistance : bottomOffset);
        backToTopButton.style.bottom = pos + 'px';
        const increment = (display === "flex" ? 1 : -1) * animationDistance/(animationTime/timeStep);
        const id = setInterval(frame, timeStep);
        const steps = animationTime / timeStep;
        var step = 0;
        function frame() {
            if (step === steps - 1) {
                  backToTopButton.style.bottom = (display === "flex" ? bottomOffset : bottomOffset-animationDistance) + 'px';
                  clearInterval(id);
            } else {
                  pos += increment;
                  backToTopButton.style.bottom = pos + 'px';
            }
            step++;
        }
        shown = true;
    } else {
        shown = false;
    }
}

const windowScrollHandler_TO_TOP = () => {
    if (document.body.scrollTop >= header_and_navigatorBlock_height || document.documentElement.scrollTop >= header_and_navigatorBlock_height) {
        moveBackToTopButton("flex");
    } else {
        moveBackToTopButton("none");
    }
}

// When the user scrolls down 20px from the top of the document, show the button
window.addEventListener("scroll", windowScrollHandler_TO_TOP);


// When the user clicks on the button, scroll to the top of the document
const goToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    window.scrollTo(0,0);
}