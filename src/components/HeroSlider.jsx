import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const AUTOPLAY_MS = 4000;
const FADE_DURATION = 0.9;

export default function HeroSlider({ images = [] }) {
  const slides = images.slice(0, 5);

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const slideRefs = useRef([]);
  const timerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const containerRef = useRef(null);

  slideRefs.current = [];
  const addSlideRef = (el) => {
    if (el) slideRefs.current.push(el);
  };

  // Initial mount: first slide visible, rest hidden
  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      gsap.set(el, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.04, zIndex: i === 0 ? 2 : 1 });
    });
    indexRef.current = 0;
    setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const goTo = (nextIndex) => {
    if (nextIndex === indexRef.current || isAnimatingRef.current) return;
    if (slides.length <= 1) return;

    const current = slideRefs.current[indexRef.current];
    const next = slideRefs.current[nextIndex];
    if (!current || !next) return;

    isAnimatingRef.current = true;

    gsap.set(next, { opacity: 0, scale: 1.04, zIndex: 2 });
    gsap.set(current, { zIndex: 1 });

    const tl = gsap.timeline({
      defaults: { duration: FADE_DURATION, ease: "power2.inOut" },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    tl.to(current, { opacity: 0 }, 0)
      .to(next, { opacity: 1, scale: 1 }, 0);

    indexRef.current = nextIndex;
    setIndex(nextIndex);
  };

  const resetAutoplay = () => {
    clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      const next = (indexRef.current + 1) % slides.length;
      goTo(next);
    }, AUTOPLAY_MS);
  };

  const goToUser = (i) => {
    goTo(i);
    resetAutoplay();
  };

  useEffect(() => {
    resetAutoplay();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  // Simple entrance animation for the whole slider block
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  if (slides.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink"
    >
      {slides.map((src, i) => (
        <img
          key={src + i}
          ref={addSlideRef}
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain will-change-transform"
        />
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToUser(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
