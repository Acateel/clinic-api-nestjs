const swiper = new Swiper(".swiper", {
  slidesPerView: 1,
  slideActiveClass: "text-bg-primary",
  pagination: {
    el: ".swiper-pagination",
  },
  breakpoints: {
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
      slideActiveClass: "___",
      slideNextClass: "text-bg-primary",
    },
  },
});

async function main() {
  let promise = await fetch("http://localhost:3000/api/v1/departments");
  const depts = await promise.json();

  depts.forEach((dept) => {
    departments.insertAdjacentHTML("beforebegin", `<div>${dept.name}<div/>`);
  });
}

main();
