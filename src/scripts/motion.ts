import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s as any) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s as any)) as T[];

let lenis: Lenis | null = null;

/* ------------------------------------------------------------------ */
/* Basics that work even with reduced motion                           */
/* ------------------------------------------------------------------ */
function initMenu() {
  const btn = $("[data-menu-btn]");
  const menu = $("[data-mobile-menu]");
  if (!btn || !menu) return;
  const set = (open: boolean) => {
    btn.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    open ? lenis?.stop() : lenis?.start();
  };
  btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      set(false);
      btn.focus();
    }
  });
  $$("[data-menu-link]").forEach((a) => a.addEventListener("click", () => set(false)));
}

function initAnchors() {
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href")!;
      const target = id === "#top" ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      // chừa chỗ cho header cố định khi nhảy tới một mục
      if (lenis) lenis.scrollTo(target as any, { duration: 1.6, offset: target === 0 ? 0 : -96 });
      else if (target === 0) scrollTo({ top: 0, behavior: "smooth" });
      else (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
    });
  });
}

function initHeader() {
  const header = $("[data-header]");
  if (!header) return;
  let last = 0;
  const onScroll = (y: number) => {
    header.classList.toggle("is-scrolled", y > 20);
    const menuOpen = $("[data-mobile-menu]")?.classList.contains("is-open");
    header.classList.toggle("is-hidden", !menuOpen && y > 300 && y > last);
    last = y;
  };
  if (lenis) lenis.on("scroll", ({ scroll }: { scroll: number }) => onScroll(scroll));
  else addEventListener("scroll", () => onScroll(scrollY), { passive: true });
}

/* ------------------------------------------------------------------ */
/* Smooth scroll                                                       */
/* ------------------------------------------------------------------ */
function initLenis() {
  lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ------------------------------------------------------------------ */
/* Cursor + magnetic + tilt                                            */
/* ------------------------------------------------------------------ */
function initCursor() {
  if (!finePointer) return;
  const ring = $(".cursor")!;
  const dot = $(".cursor-dot")!;
  const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
  const dx = gsap.quickTo(dot, "x", { duration: 0.1 });
  const dy = gsap.quickTo(dot, "y", { duration: 0.1 });
  let shown = false;
  addEventListener("pointermove", (e) => {
    if (!shown) {
      gsap.to([ring, dot], { opacity: 1, duration: 0.3 });
      shown = true;
    }
    rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
  });
  document.addEventListener("pointerleave", () => {
    gsap.to([ring, dot], { opacity: 0, duration: 0.3 });
    shown = false;
  });
  $$("a, button, [data-hover]").forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("is-hover"));
    el.addEventListener("pointerleave", () => ring.classList.remove("is-hover"));
  });
}

function initMagnetic() {
  if (!finePointer) return;
  $$("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
    });
  });
}

function initTilt() {
  if (!finePointer) return;
  $$("[data-tilt]").forEach((el) => {
    const rX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const rY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rY((px - 0.5) * 14);
      rX((0.5 - py) * 14);
      el.style.setProperty("--x", `${px * 100}%`);
      el.style.setProperty("--y", `${py * 100}%`);
    });
    el.addEventListener("pointerleave", () => { rX(0); rY(0); });
  });
}

/* ------------------------------------------------------------------ */
/* Preloader + hero intro                                              */
/* ------------------------------------------------------------------ */
function intro() {
  const pre = $(".preloader")!;
  const count = $("[data-preload-count]")!;
  const lines = $$(".hero-line");
  const fades = $$("[data-hero-fade]");
  const seen = document.documentElement.classList.contains("intro-seen");

  gsap.set(lines, { yPercent: 115, rotate: 4, transformOrigin: "0% 100%" });
  gsap.set(fades, { opacity: 0, y: 30 });
  gsap.set("[data-bagua]", { scale: 0.6, opacity: 0, rotate: -60 });

  const tl = gsap.timeline({ onComplete: () => lenis?.start() });

  // Lần đầu trong phiên: màn chờ ngắn (~1.6s). Những lần sau vào thẳng hero.
  if (!seen) {
    lenis?.stop();
    const counter = { v: 0 };
    gsap.set(".preloader-logo span", { y: 0, yPercent: 110 });
    tl.to(".preloader-logo span", { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "expo.out" }, 0)
      .to(counter, {
        v: 100,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => (count.textContent = String(Math.round(counter.v))),
      }, 0)
      .to(".preloader-bar span", { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0)
      .to(".preloader-logo span", { yPercent: -110, duration: 0.45, stagger: 0.04, ease: "expo.in" }, 1.0)
      .to(pre, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" }, 1.25)
      .set(pre, { display: "none" });
  }

  const t0 = seen ? 0.1 : 1.6;
  tl.to(lines, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.09, ease: "expo.out" }, t0)
    .to("[data-bagua]", { scale: 1, opacity: 1, rotate: 0, duration: 2, ease: "expo.out" }, t0)
    .to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, t0 + 0.35);
}

function initCapabilities() {
  $$("[data-cap]").forEach((row) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } });
    tl.from($(".cap-line", row), { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
      .from($$(".cap-no, .cap-title", row), { yPercent: 60, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.3)
      .from($$(".cap-body p, .cap-tags li", row), { y: 20, opacity: 0, duration: 0.8, stagger: 0.05, ease: "expo.out" }, 0.45);
  });
}

/* ------------------------------------------------------------------ */
/* Scroll-driven effects                                               */
/* ------------------------------------------------------------------ */
function initProgress() {
  gsap.to(".progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });
}

function initHeroScroll() {
  const hero = $("[data-hero]");
  if (!hero) return;
  gsap.to("[data-hero-content]", {
    yPercent: -25,
    opacity: 0.15,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to("[data-bagua]", {
    rotate: 120,
    scale: 1.25,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
  if (finePointer) {
    const spot = $("[data-spotlight]")!;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
      spot.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  }
}

function initReveal() {
  const els = $$("[data-reveal]").filter((el) => !el.closest("[data-hero]"));
  gsap.set(els, { opacity: 0, y: 50 });
  ScrollTrigger.batch(els, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, ease: "expo.out", overwrite: true }),
  });
}

function initSplitHeadings() {
  $$("[data-split]").forEach((el) => {
    const split = SplitText.create(el, { type: "lines,words", mask: "lines", wordsClass: "word" });
    gsap.from(split.words, {
      yPercent: 120,
      rotate: 6,
      duration: 1.3,
      stagger: 0.06,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });
}

function initScrubWords() {
  $$("[data-scrub-words]").forEach((el) => {
    const split = SplitText.create(el, { type: "words", wordsClass: "word" });
    gsap.fromTo(
      split.words,
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
      },
    );
  });
}

function initScrubChars() {
  $$("[data-scrub-chars]").forEach((el) => {
    const split = SplitText.create(el, { type: "words,chars", charsClass: "char" });
    gsap.from(split.chars, {
      yPercent: 80,
      opacity: 0,
      rotateX: -90,
      stagger: 0.03,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 55%", scrub: 1 },
    });
  });
}

function initMarquee() {
  $$("[data-marquee]").forEach((row) => {
    const dir = Number(row.dataset.marquee);
    const tween = gsap.fromTo(
      row,
      { xPercent: dir < 0 ? 0 : -33.333 },
      { xPercent: dir < 0 ? -33.333 : 0, duration: 40, ease: "none", repeat: -1 },
    );
    // tăng tốc + nghiêng chữ theo vận tốc cuộn
    const skewTo = gsap.quickTo(row, "skewX", { duration: 0.5, ease: "power3" });
    let speedTl: gsap.core.Timeline | undefined;
    let settle: gsap.core.Tween | undefined;
    ScrollTrigger.create({
      trigger: row,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        speedTl?.kill();
        speedTl = gsap.timeline()
          .to(tween, { timeScale: 1 + Math.min(Math.abs(v) / 300, 6), duration: 0.2 })
          .to(tween, { timeScale: 1, duration: 1.2, ease: "power2.out" });
        skewTo(gsap.utils.clamp(-8, 8, v / -300));
        settle?.kill();
        settle = gsap.delayedCall(0.15, () => skewTo(0));
      },
    });
  });
}

function initShowcase() {
  $$("[data-showcase]").forEach((sc) => {
    const phone = $("[data-phone]", sc)!;
    const ring = $("[data-ring]", sc)!;
    const hexLines = $$(".hline span", sc);
    const features = $$("[data-feature]", sc);
    const chips = $$("[data-chip]", sc);

    gsap.from(phone, {
      y: 160,
      rotateX: 25,
      rotateZ: -8,
      scale: 0.85,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: sc, start: "top bottom", end: "top 25%", scrub: 1 },
    });
    gsap.to(ring, {
      rotate: 180,
      ease: "none",
      scrollTrigger: { trigger: sc, start: "top bottom", end: "bottom top", scrub: true },
    });
    chips.forEach((c) => {
      const speed = Number(c.dataset.speed || 1);
      gsap.fromTo(c, { y: 120 * speed, opacity: 0 }, {
        y: -60 * speed,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: sc, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    gsap.from(hexLines, {
      scaleX: 0,
      duration: 0.8,
      stagger: { each: 0.12, from: "end" },
      ease: "expo.out",
      scrollTrigger: { trigger: phone, start: "top 70%", once: true },
    });
    // nhẹ nhàng lơ lửng
    gsap.to(phone, { yPercent: -3, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const setActive = (i: number) => features.forEach((f, k) => f.classList.toggle("is-active", k <= i));
      setActive(-1);
      ScrollTrigger.create({
        trigger: sc,
        start: "top top",
        end: `+=${features.length * 45}%`,
        pin: true,
        scrub: true,
        // chia đoạn cuộn thành (n + 1) phần: phần đầu chưa sáng mục nào, sau đó sáng dần từng mục
        onUpdate: (self) => setActive(Math.min(features.length - 1, Math.floor(self.progress * (features.length + 1)) - 1)),
      });
      gsap.to(phone, {
        rotateY: -14,
        rotateX: 6,
        ease: "none",
        scrollTrigger: { trigger: sc, start: "top top", end: `+=${features.length * 45}%`, scrub: true },
      });
      return () => features.forEach((f) => f.classList.remove("is-active"));
    });
  });
}

function initCards() {
  const cards = $$("[data-card]");
  if (!cards.length) return;
  gsap.from(cards, {
    y: 160,
    rotateX: -35,
    opacity: 0,
    transformOrigin: "50% 100%",
    duration: 1.4,
    stagger: 0.15,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-cards]", start: "top 85%", once: true },
  });
}

function initTimeline() {
  const tl = $("[data-timeline]");
  if (!tl) return;
  gsap.to("[data-timeline-fill]", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: { trigger: tl, start: "top 60%", end: "bottom 60%", scrub: true },
  });
  $$("[data-step]").forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 62%",
      onEnter: () => step.classList.add("is-active"),
      onLeaveBack: () => step.classList.remove("is-active"),
    });
  });
}

function initFooter() {
  const giant = $("[data-giant]");
  if (!giant) return;
  gsap.from($$("span", giant), {
    yPercent: 100,
    stagger: 0.08,
    ease: "none",
    scrollTrigger: { trigger: giant, start: "top bottom", end: "bottom bottom", scrub: 1 },
  });
}

/* ------------------------------------------------------------------ */
async function init() {
  if (reduced) {
    initMenu();
    initAnchors();
    initHeader();
    return;
  }

  // Vào từ link dạng "/#san-pham": nếu để trình duyệt tự nhảy tới mục trong lúc ScrollTrigger đang khởi tạo
  // thì các trigger `once` bị kích hoạt và tự huỷ giữa chừng → lỗi. Tạm gỡ hash, cuộn tới mục sau khi khởi tạo xong.
  const hash = location.hash;
  if (hash) history.replaceState(null, "", location.pathname + location.search);

  history.scrollRestoration = "manual";
  scrollTo(0, 0);

  initLenis();
  initMenu();
  initAnchors();
  initHeader();

  await document.fonts.ready;

  intro();
  initCursor();
  initMagnetic();
  initTilt();
  initProgress();
  initHeroScroll();
  // tạo pin trước để các trigger phía dưới tính đúng khoảng pin-spacing
  initShowcase();
  initSplitHeadings();
  initScrubWords();
  initScrubChars();
  initReveal();
  initCapabilities();
  initMarquee();
  initCards();
  initTimeline();
  initFooter();

  ScrollTrigger.refresh();

  if (hash) {
    history.replaceState(null, "", location.pathname + location.search + hash);
    const target = $(decodeURIComponent(hash));
    // Lenis lưu chiều cao trang từ trước khi pin-spacing được thêm → đo lại trước khi cuộn
    lenis?.resize();
    if (target) lenis?.scrollTo(target, { immediate: true, force: true });
  }
}

init();
