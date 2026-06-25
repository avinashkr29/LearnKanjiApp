document.addEventListener('DOMContentLoaded', function() {
    const showcase = document.querySelector('.screenshot-showcase');
    const track = document.querySelector('.screenshot-track');
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let previousTranslate = 0;
    let animationID = null;
    let isAnimating = true;
    const scrollSpeed = 1;

    track.style.animation = 'none';

    const calculateTrackWidth = () => {
        let totalWidth = 0;
        for (let item of track.children) totalWidth += item.offsetWidth;
        return totalWidth;
    };

    function animate() {
        if (isAnimating && !isDragging) {
            currentTranslate -= scrollSpeed;
            const trackWidth = calculateTrackWidth();
            if (Math.abs(currentTranslate) >= trackWidth / 2) currentTranslate = 0;
            previousTranslate = currentTranslate;
            setSliderPosition();
        }
        if (isAnimating && !isDragging) animationID = requestAnimationFrame(animate);
    }

    function touchStart(event) {
        if (event.type === 'touchstart') event.preventDefault();
        isAnimating = false;
        startPosition = getPositionX(event);
        isDragging = true;
        showcase.classList.add('grabbing');
        if (animationID !== null) { cancelAnimationFrame(animationID); animationID = null; }
    }

    function touchMove(event) {
        if (!isDragging) return;
        event.preventDefault();
        currentTranslate = previousTranslate + (getPositionX(event) - startPosition);
        setSliderPosition();
    }

    function touchEnd() {
        isDragging = false;
        showcase.classList.remove('grabbing');
        previousTranslate = currentTranslate;
        if (!showcase.matches(':hover') && !isAnimating) {
            isAnimating = true;
            animationID = requestAnimationFrame(animate);
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function setSliderPosition() {
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    showcase.addEventListener('mousedown', touchStart);
    showcase.addEventListener('mousemove', touchMove);
    showcase.addEventListener('mouseup', touchEnd);
    showcase.addEventListener('mouseleave', touchEnd);
    showcase.addEventListener('touchstart', touchStart, { passive: false });
    showcase.addEventListener('touchmove', touchMove, { passive: false });
    showcase.addEventListener('touchend', touchEnd);
    showcase.addEventListener('touchcancel', touchEnd);
    showcase.addEventListener('contextmenu', e => e.preventDefault());

    showcase.addEventListener('mouseenter', () => {
        isAnimating = false;
        if (animationID !== null) { cancelAnimationFrame(animationID); animationID = null; }
    });

    showcase.addEventListener('mouseleave', () => {
        if (!isDragging && !isAnimating) {
            isAnimating = true;
            animationID = requestAnimationFrame(animate);
        }
    });

    animationID = requestAnimationFrame(animate);
});
