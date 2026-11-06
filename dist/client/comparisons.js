document.querySelectorAll('.comparison-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.comparison-track');
  const controls = carousel.querySelector('.carousel-controls');
  const buttons = [...controls.querySelectorAll('button')];
  controls.hidden = false;
  const update = () => {
    buttons[0].disabled = track.scrollLeft <= 2;
    buttons[1].disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const move = (direction) => {
    const card = track.querySelector('.card');
    track.scrollBy({left: direction * (card.getBoundingClientRect().width + 20), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  buttons.forEach(button => button.addEventListener('click', () => move(Number(button.dataset.direction))));
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('scroll', update, {passive:true});
  new ResizeObserver(update).observe(track);
  update();
});
