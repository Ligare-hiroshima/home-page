// Smooth scroll for hash links if nav is added later.
document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLAnchorElement)) return;
  const href = target.getAttribute("href") || "";
  if (!href.startsWith("#")) return;

  const section = document.querySelector(href);
  if (!section) return;

  event.preventDefault();
  section.scrollIntoView({ behavior: "smooth", block: "start" });
});

const siteMenu = document.querySelector(".site-menu");
if (siteMenu instanceof HTMLElement) {
  siteMenu.classList.remove("is-on-hero");
}

const menuToggle = document.querySelector(".menu-toggle");
const menuLinks = document.querySelector(".site-menu-links");
if (
  siteMenu instanceof HTMLElement &&
  menuToggle instanceof HTMLButtonElement &&
  menuLinks instanceof HTMLElement
) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menuLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const memberCards = document.querySelectorAll(".member-card");
memberCards.forEach((card) => {
  if (!(card instanceof HTMLElement)) return;

  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });
});

const worksCarousels = document.querySelectorAll("[data-works-carousel]");
worksCarousels.forEach((carousel) => {
  if (!(carousel instanceof HTMLElement)) return;

  const track = carousel.querySelector(".works-grid");
  const slides = carousel.querySelectorAll(".work-card");
  const prevBtn = carousel.querySelector(".works-nav.prev");
  const nextBtn = carousel.querySelector(".works-nav.next");
  const dotsRoot = carousel.querySelector(".works-dots");

  if (
    !(track instanceof HTMLElement) ||
    !(prevBtn instanceof HTMLButtonElement) ||
    !(nextBtn instanceof HTMLButtonElement) ||
    !(dotsRoot instanceof HTMLElement) ||
    slides.length === 0
  ) {
    return;
  }

  let index = 0;
  const dots = Array.from(slides, (_, dotIndex) => {
    const dot = document.createElement("span");
    dot.className = "works-dot";
    if (dotIndex === 0) dot.classList.add("is-active");
    dotsRoot.appendChild(dot);
    return dot;
  });

  const sync = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  prevBtn.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    sync();
  });

  nextBtn.addEventListener("click", () => {
    index = Math.min(slides.length - 1, index + 1);
    sync();
  });

  sync();
});
