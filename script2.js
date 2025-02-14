document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor");
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
});

const button = document.getElementById("enterButton");

button.addEventListener('mouseover', () => {
  const cursor = document.querySelector('.cursor');
  cursor.style.transform = 'scale(4)'; // Scale up
});

button.addEventListener('mouseout', () => {
  const cursor = document.querySelector('.cursor');
  cursor.style.transform = 'scale(1)'; // Reset to original size
});
  
window.sections = [...document.querySelectorAll('.section')];

document.body.style.background = window.sections[0].getAttribute('data-bg');

window.addEventListener('scroll', onScroll);

function onScroll() {

  const section = window.sections
    .map(section => {
      const el = section;
      const rect = el.getBoundingClientRect();
      return {el, rect};
    })
    .find(section => section.rect.bottom >= (window.innerHeight * 0.5));
  document.body.style.background = section.el.getAttribute('data-bg');
}