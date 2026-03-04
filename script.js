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

const overlayLightZone = document.querySelector("[data-overlay-trigger]");
const memberSection = document.querySelector("#member");
if (overlayLightZone instanceof HTMLElement) {
  const setOverlayState = (isLight) => {
    document.body.classList.toggle("is-overlay-light", isLight);
  };
  const desktopQuery = window.matchMedia("(min-width: 901px)");
  const syncOverlayState = () => {
    if (!desktopQuery.matches) {
      setOverlayState(false);
      return;
    }
    const triggerLine = (siteMenu instanceof HTMLElement ? siteMenu.offsetHeight : 0) + 8;
    const isInFinalZone = memberSection instanceof HTMLElement
      ? memberSection.getBoundingClientRect().bottom <= triggerLine
      : overlayLightZone.getBoundingClientRect().top <= triggerLine;
    setOverlayState(isInFinalZone);
  };
  window.addEventListener("scroll", syncOverlayState, { passive: true });
  window.addEventListener("resize", syncOverlayState);
  window.addEventListener("orientationchange", syncOverlayState);
  if (menuToggle instanceof HTMLButtonElement) {
    menuToggle.addEventListener("click", () => {
      window.requestAnimationFrame(syncOverlayState);
    });
  }
  syncOverlayState();
}

const memberCards = document.querySelectorAll(".member-card");
memberCards.forEach((card) => {
  if (!(card instanceof HTMLElement)) return;

  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });
});

// Initialize mural logo draw animation by computing path length once.
const initHeroLogoDraw = () => {
  const logoWrap = document.querySelector(".hero-logo-draw");
  const logoPath = document.querySelector(".hero-logo-draw-path");
  if (!(logoWrap instanceof HTMLElement) || !(logoPath instanceof SVGPathElement)) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pathLength = logoPath.getTotalLength();
  logoPath.style.setProperty("--hero-logo-path-length", `${pathLength}`);
  logoPath.style.strokeDasharray = `${pathLength}`;
  logoPath.style.strokeDashoffset = `${pathLength}`;

  window.requestAnimationFrame(() => {
    logoWrap.classList.add("is-ready");
  });
};

initHeroLogoDraw();

const scrollRevealTargets = document.querySelectorAll(
  ".section h2, .section .text, .activity-list li, .card, .works-group, .member-card, .contact-link"
);
if (scrollRevealTargets.length > 0) {
  scrollRevealTargets.forEach((element, index) => {
    if (!(element instanceof HTMLElement)) return;
    element.classList.add("scroll-reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 360)}ms`);
  });

  const showElement = (element) => {
    element.classList.add("is-visible");
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!(entry.target instanceof HTMLElement)) return;
          showElement(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.15,
      }
    );

    scrollRevealTargets.forEach((element) => {
      if (element instanceof HTMLElement) revealObserver.observe(element);
    });
  } else {
    scrollRevealTargets.forEach((element) => {
      if (element instanceof HTMLElement) showElement(element);
    });
  }
}

const initCarousel = ({
  rootSelector,
  trackSelector,
  slideSelector,
  prevSelector,
  nextSelector,
  dotsSelector,
  dotClassName,
  autoAdvanceMs = 0,
  enabledMediaQuery = "",
  stepByViewport = false,
  loop = false,
}) => {
  const carousels = document.querySelectorAll(rootSelector);
  carousels.forEach((carousel) => {
    if (!(carousel instanceof HTMLElement)) return;

    const track = carousel.querySelector(trackSelector);
    const slides = carousel.querySelectorAll(slideSelector);
    const prevBtn = carousel.querySelector(prevSelector);
    const nextBtn = carousel.querySelector(nextSelector);
    const dotsRoot = carousel.querySelector(dotsSelector);

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
    const mediaQuery =
      enabledMediaQuery.length > 0 ? window.matchMedia(enabledMediaQuery) : null;
    const isEnabled = () => (mediaQuery ? mediaQuery.matches : true);
    const dots = Array.from(slides, (_, dotIndex) => {
      const dot = document.createElement("span");
      dot.className = dotClassName;
      if (dotIndex === 0) dot.classList.add("is-active");
      dotsRoot.appendChild(dot);
      return dot;
    });

    const sync = () => {
      if (!isEnabled()) {
        track.style.transform = "translateX(0)";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("is-active", dotIndex === 0);
        });
        return;
      }

      const currentSlide = slides[index];
      const offset = stepByViewport
        ? index * carousel.clientWidth
        : currentSlide instanceof HTMLElement
          ? currentSlide.offsetLeft
          : 0;
      track.style.transform = `translateX(-${offset}px)`;
      prevBtn.disabled = !loop && index === 0;
      nextBtn.disabled = !loop && index === slides.length - 1;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    };

    prevBtn.addEventListener("click", () => {
      if (!isEnabled()) return;
      index = loop
        ? (index - 1 + slides.length) % slides.length
        : Math.max(0, index - 1);
      sync();
    });

    nextBtn.addEventListener("click", () => {
      if (!isEnabled()) return;
      index = loop
        ? (index + 1) % slides.length
        : Math.min(slides.length - 1, index + 1);
      sync();
    });

    if (autoAdvanceMs > 0) {
      window.setInterval(() => {
        if (!isEnabled()) return;
        index = loop ? (index + 1) % slides.length : Math.min(slides.length - 1, index + 1);
        sync();
      }, autoAdvanceMs);
    }

    window.addEventListener("resize", sync);
    sync();
  });
};

initCarousel({
  rootSelector: "[data-works-carousel]",
  trackSelector: ".works-grid",
  slideSelector: ".work-card",
  prevSelector: ".works-nav.prev",
  nextSelector: ".works-nav.next",
  dotsSelector: ".works-dots",
  dotClassName: "works-dot",
});

initCarousel({
  rootSelector: "[data-activity-carousel]",
  trackSelector: ".activity-list",
  slideSelector: ".activity-list li",
  prevSelector: ".works-nav.prev",
  nextSelector: ".works-nav.next",
  dotsSelector: ".works-dots",
  dotClassName: "works-dot",
  autoAdvanceMs: 5000,
  enabledMediaQuery: "(max-width: 900px)",
  stepByViewport: true,
  loop: true,
});
