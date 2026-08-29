// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import gsap from "gsap";
// import { ArrowRight } from "lucide-react";
// import Container from "../components/Container";
// import ProductCard from "../components/ProductCard";
// import { useScrollReveal } from "../hooks/useScrollReveal";
// import axios from "axios";
// import About from "../components/About";

// import {  useLayoutEffect} from "react";
// // import { Link } from "react-router-dom";
// // import { ArrowRight } from "lucide-react";
// // import gsap from "gsap";






// export default function Home() {
//   const [product, setProduct] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const heroRef = useRef(null);
//   const categoryRef = useScrollReveal();
//   const productRef = useScrollReveal({ stagger: 0.06 });










//   // const heroRef = useRef(null);
//   const stageRef = useRef(null);
//   const cubeRef = useRef(null);
//   const shadowRef = useRef(null);

//   const [half, setHalf] = useState(160);

// // ------------------------------------------------------------------
// // Dashboard theke asbe — abhi dummy data (max 6):
// const HERO_IMAGES_RAW = [
//   "https://picsum.photos/seed/gear-01/900/900",
//   "https://picsum.photos/seed/gear-02/900/900",
//   "https://picsum.photos/seed/gear-03/900/900",
//   "https://picsum.photos/seed/gear-04/900/900",
//   "https://picsum.photos/seed/gear-05/900/900",
//   "https://picsum.photos/seed/gear-06/900/900",
// ];
// // ------------------------------------------------------------------

// // Always outputs 6 slots. Kom image dile repeat kore fill kore.
// function buildCubeFaces(images) {
//   const src = images.slice(0, 6).filter(Boolean);
//   if (src.length === 0) return Array(6).fill("");
//   return Array.from({ length: 6 }, (_, i) => src[i % src.length]);
// }

// const RETURN_DURATION = 0.8;
// const RANDOM_MIN_DUR = 1.4;
// const RANDOM_MAX_DUR = 2.2;

// // Full 6-face cube: front/back/left/right/top/bottom — shob paashe image
// const FACE_CONFIG = [
//   { key: "front", transform: (h) => `rotateY(0deg) translateZ(${h}px)`, shade: 0 },
//   { key: "back", transform: (h) => `rotateY(180deg) translateZ(${h}px)`, shade: 0.32 },
//   { key: "right", transform: (h) => `rotateY(90deg) translateZ(${h}px)`, shade: 0.18 },
//   { key: "left", transform: (h) => `rotateY(-90deg) translateZ(${h}px)`, shade: 0.18 },
//   { key: "top", transform: (h) => `rotateX(90deg) translateZ(${h}px)`, shade: 0.1 },
//   { key: "bottom", transform: (h) => `rotateX(-90deg) translateZ(${h}px)`, shade: 0.4 },
// ];
//   const rotationRef = useRef({ x: 0, y: 0 }); // initial: soja, x=0 y=0
//   const dragState = useRef({ dragging: false, startX: 0, startY: 0, fromX: 0, fromY: 0 });
//   const autoTweenRef = useRef(null);
//   const isActiveRef = useRef(true); // component mounted guard

//   useLayoutEffect(() => {
//     const el = stageRef.current;
//     if (!el) return;
//     const update = () => setHalf(el.clientWidth / 2);
//     update();
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   const applyRotation = () => {
//     if (cubeRef.current) {
//       gsap.set(cubeRef.current, {
//         rotateX: rotationRef.current.x,
//         rotateY: rotationRef.current.y,
//       });
//     }
//   };

//   const setShadowIntensity = (level) => {
//     // 0 = resting, 1 = hover/dragging
//     gsap.to(shadowRef.current, {
//       opacity: level === 0 ? 0.75 : 1,
//       scale: level === 0 ? 1 : 1.22,
//       filter: `blur(${level === 0 ? 60 : 78}px)`,
//       duration: 0.5,
//       ease: "power2.out",
//     });
//   };

//   const scheduleRandomRotate = () => {
//     if (!isActiveRef.current) return;
//     const dx = gsap.utils.random(-30, 30);
//     const dy = gsap.utils.random(70, 150) * (Math.random() < 0.5 ? -1 : 1);
//     autoTweenRef.current = gsap.to(rotationRef.current, {
//       x: rotationRef.current.x + dx,
//       y: rotationRef.current.y + dy,
//       duration: gsap.utils.random(RANDOM_MIN_DUR, RANDOM_MAX_DUR),
//       ease: "sine.inOut",
//       onUpdate: applyRotation,
//       onComplete: scheduleRandomRotate,
//     });
//   };

//   const stopAutoRotate = () => {
//     if (autoTweenRef.current) {
//       autoTweenRef.current.kill();
//       autoTweenRef.current = null;
//     }
//     gsap.killTweensOf(rotationRef.current);
//   };

//   const returnToInitialThenResume = () => {
//     stopAutoRotate();
//     gsap.to(rotationRef.current, {
//       x: 0,
//       y: 0,
//       duration: RETURN_DURATION,
//       ease: "power3.out",
//       onUpdate: applyRotation,
//       onComplete: scheduleRandomRotate,
//     });
//   };

//   useEffect(() => {
//     isActiveRef.current = true;
//     scheduleRandomRotate();
//     return () => {
//       isActiveRef.current = false;
//       stopAutoRotate();
//     };
//   }, []);

//   // ---- Pointer drag-to-rotate (free 360 on both axes) ----
//   const onPointerDown = (e) => {
//     stopAutoRotate();
//     setShadowIntensity(1);
//     dragState.current = {
//       dragging: true,
//       startX: e.clientX,
//       startY: e.clientY,
//       fromX: rotationRef.current.x,
//       fromY: rotationRef.current.y,
//     };
//     window.addEventListener("pointermove", onPointerMove);
//     window.addEventListener("pointerup", onPointerUp);
//   };

//   const onPointerMove = (e) => {
//     if (!dragState.current.dragging) return;
//     const dx = e.clientX - dragState.current.startX;
//     const dy = e.clientY - dragState.current.startY;

//     rotationRef.current.y = dragState.current.fromY + dx * 0.5;
//     rotationRef.current.x = dragState.current.fromX - dy * 0.5; // no clamp — full 360 possible
//     applyRotation();
//   };

//   const endDrag = () => {
//     if (!dragState.current.dragging) return;
//     dragState.current.dragging = false;
//     window.removeEventListener("pointermove", onPointerMove);
//     window.removeEventListener("pointerup", onPointerUp);
//     setShadowIntensity(0);
//     returnToInitialThenResume();
//   };

//   const onPointerUp = () => endDrag();
//   const onPointerLeave = () => endDrag();
//   const onPointerEnter = () => {
//     if (!dragState.current.dragging) setShadowIntensity(1);
//   };

//   const faces = buildCubeFaces(HERO_IMAGES_RAW);






//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
//       tl.from("[data-hero-eyebrow]", { opacity: 0, y: 14, duration: 0.5 })
//         .from("[data-hero-word]", { opacity: 0, y: 40, stagger: 0.08, duration: 0.7 }, "-=0.2")
//         .from("[data-hero-sub]", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3")
//         .from("[data-hero-cta]", { opacity: 0, y: 16, duration: 0.5 }, "-=0.4");
//     }, heroRef);
//     return () => ctx.revert();
//   }, []);

//   //Active product
//   useEffect(() => {
//     try {
//       async function getProduct() {
//         let data = await axios.get(`https://nova-market-backend-2.onrender.com/api/v1/product/allActiveProduct`);
//         setProduct(data.data.products);
        
//       }
//       getProduct();
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   // categories
//   useEffect(() => {
//     const getCategories = async () => {
//       try {
//         const response = await axios.get(
//           "https://nova-market-backend-2.onrender.com/api/v1/product/allCategory"
//         );
//         const list = (response.data.allCategory || []).map(
//           (category) => category.name
//         );
//         setCategories(list);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getCategories();
//   }, []);

//   return (
//     <div>


// <section ref={heroRef} className="relative overflow-hidden bg-ink text-white">
//   <Container className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:py-28">
//     {/* Text content — 50% */}
//     <div>
//       <p data-hero-eyebrow className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
//         New season, new drops
//       </p>
//       <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
//         <span className="block overflow-hidden">
//           <span data-hero-word className="block">Everyday gear,</span>
//         </span>
//         <span className="block overflow-hidden">
//           <span data-hero-word className="block text-brand-400">designed with intent.</span>
//         </span>
//       </h1>
//       <p data-hero-sub className="mt-6 max-w-md text-white/60">
//         Curated tech and lifestyle products from makers who obsess over the details, so you don't have to.
//       </p>
//       <div data-hero-cta className="mt-8 flex flex-wrap gap-3">
//         <Link to="/products" className="flex h-12 items-center gap-2 rounded-full bg-brand-400 px-6 text-sm font-semibold text-ink transition hover:bg-brand-300">
//           Shop the collection <ArrowRight size={16} />
//         </Link>
//         <Link to="/products" className="flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/5">
//           Explore categories
//         </Link>
//       </div>
//     </div>

//     {/* Image content — 50%, interactive full 6-face 3D cube (responsive, smaller) */}
//     <div className="flex justify-center">
//       <div
//         ref={stageRef}
//         className="relative w-40 aspect-square cursor-grab touch-none select-none active:cursor-grabbing sm:w-52 md:w-60 lg:w-64 xl:w-72"
//         style={{ perspective: 1400 }}
//         onPointerDown={onPointerDown}
//         onPointerEnter={onPointerEnter}
//         onPointerLeave={onPointerLeave}
//       >
//         {/* Big colorful ambient shadow behind the cube */}
//         <div
//           ref={shadowRef}
//           className="pointer-events-none absolute -inset-10 rounded-full sm:-inset-14 lg:-inset-16"
//           style={{
//             opacity: 0.75,
//             filter: "blur(48px)",
//             background:
//               "conic-gradient(from 120deg, rgba(124,58,237,0.75), rgba(6,182,212,0.7), rgba(244,63,94,0.7), rgba(245,158,11,0.7), rgba(124,58,237,0.75))",
//           }}
//         />

//         <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
//           <div ref={cubeRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
//             {FACE_CONFIG.map((face, i) => (
//               <div
//                 key={face.key}
//                 className="absolute inset-0 overflow-hidden border border-white/10"
//                 style={{
//                   transformStyle: "preserve-3d",
//                   transform: face.transform(half),
//                   backfaceVisibility: "hidden",
//                 }}
//               >
//                 <img
//                   src={faces[i]}
//                   alt=""
//                   draggable={false}
//                   className="h-full w-full object-cover"
//                 />
//                 <div
//                   className="pointer-events-none absolute inset-0"
//                   style={{ backgroundColor: `rgba(0,0,0,${face.shade})` }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </Container>
// </section>




//       {/* Hero */}
//       {/* <section ref={heroRef} className="relative overflow-hidden bg-ink text-white">
//         <Container className="grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
//           <div>
//             <p data-hero-eyebrow className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
//               New season, new drops
//             </p>
//             <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
//               <span className="block overflow-hidden">
//                 <span data-hero-word className="block">Everyday gear,</span>
//               </span>
//               <span className="block overflow-hidden">
//                 <span data-hero-word className="block text-brand-400">designed with intent.</span>
//               </span>
//             </h1>
//             <p data-hero-sub className="mt-6 max-w-md text-white/60">
//               Curated tech and lifestyle products from makers who obsess over the details, so you don't have to.
//             </p>
//             <div data-hero-cta className="mt-8 flex flex-wrap gap-3">
//               <Link
//                 to="/products"
//                 className="flex h-12 items-center gap-2 rounded-full bg-brand-400 px-6 text-sm font-semibold text-ink transition hover:bg-brand-300"
//               >
//                 Shop the collection <ArrowRight size={16} />
//               </Link>
//               <Link
//                 to="/products"
//                 className="flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/5"
//               >
//                 Explore categories
//               </Link>
//             </div>
//           </div>

//           <div className="relative flex justify-center">
//             <div className="relative aspect-square w-full max-w-sm rounded-3xl bg-gradient-to-br from-brand-500/30 to-transparent p-1">
//               <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white/5">
//                 <span className="font-display text-sm text-white/30">Product shot</span>
//               </div>
//             </div>
//           </div>
//         </Container>
//       </section> */}

//       {/* Featured products */}
//       <section className="py-16">
//         <Container>
//           <div className="mb-8 flex items-end justify-between">
//             <div>
//               <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">Handpicked</p>
//               <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Featured products</h2>
//             </div>
//             <Link to="/products" className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block">
//               View all →
//             </Link>
//           </div>

//           <div ref={productRef} className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4">
//             {product.map((p) => (
//               <ProductCard key={p._id} product={p} />
//             ))}
//           </div>
//         </Container>
//       </section>

//     {/* categories */}
//       <section className="py-16">
//         <Container>
//              <div className="mb-10">
//               <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">Search by</p>
//               <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Categories products</h2>
//             </div>
//           <div
//             ref={categoryRef}
//             className="grid grid-cols-1 gap-6 sm:grid-cols-4"
//           >
//             {categories.map((cat) => (
//               <Link
//                 key={cat}
//                 to={`/products?category=${cat}`}
//                 data-reveal
//                 className="group overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
//               >
                
//                 {/* Category Name + View All */}
//                 <div className="flex flex-col items-center justify-center px-4 py-4 transition-colors duration-500 group-hover:bg-black/10">
//                   <h3 className="font-display text-2xl md:text-4xl font-bold capitalize text-gray-900 transition-colors duration-500">
//                     {cat}
//                   </h3>
//                   <span className="mt-4 text-sm font-medium text-gray-600 transition-colors duration-500">
//                     View All
//                   </span>
//                 </div>     
//               </Link>
//             ))}
//           </div>
//         </Container>
//       </section>
      
//       <About></About>
//     </div>
//   );
// }



import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import { useScrollReveal } from "../hooks/useScrollReveal";
import axios from "axios";
import About from "../components/About";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";
const GET_HERO_SLIDER_URL = `${API_ORIGIN}/api/v1/banner/getHeroSlider`;

function imageSrc(filename) {
  if (!filename) return "";
  if (typeof filename === "string" && filename.startsWith("http")) {
    return filename;
  }
  return `${API_ORIGIN}/upload/${filename}`;
}

// Always outputs 6 slots. Kom image thakle repeat kore fill kore.
function buildCubeFaces(images) {
  const src = (images || []).slice(0, 6).filter(Boolean);
  if (src.length === 0) return Array(6).fill("");
  return Array.from({ length: 6 }, (_, i) => src[i % src.length]);
}

const RETURN_DURATION = 0.8;
const RANDOM_MIN_DUR = 1.4;
const RANDOM_MAX_DUR = 2.2;

// Full 6-face cube: front/back/left/right/top/bottom
const FACE_CONFIG = [
  { key: "front", transform: (h) => `rotateY(0deg) translateZ(${h}px)`, shade: 0 },
  { key: "back", transform: (h) => `rotateY(180deg) translateZ(${h}px)`, shade: 0.32 },
  { key: "right", transform: (h) => `rotateY(90deg) translateZ(${h}px)`, shade: 0.18 },
  { key: "left", transform: (h) => `rotateY(-90deg) translateZ(${h}px)`, shade: 0.18 },
  { key: "top", transform: (h) => `rotateX(90deg) translateZ(${h}px)`, shade: 0.1 },
  { key: "bottom", transform: (h) => `rotateX(-90deg) translateZ(${h}px)`, shade: 0.4 },
];

export default function Home() {
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const heroRef = useRef(null);
  const categoryRef = useScrollReveal();
  const productRef = useScrollReveal({ stagger: 0.06 });

  const stageRef = useRef(null);
  const cubeRef = useRef(null);
  const shadowRef = useRef(null);

  const [half, setHalf] = useState(160);

  // ---- Banner images from API ----
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(GET_HERO_SLIDER_URL);
        const images = response.data?.data?.images || [];
        setBannerImages(images.map(imageSrc));
      } catch (error) {
        console.log("Banner fetch error:", error);
        setBannerImages([]);
      }
    };
    fetchBanner();
  }, []);

  const faces = buildCubeFaces(bannerImages);

  const rotationRef = useRef({ x: 0, y: 0 });
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, fromX: 0, fromY: 0 });
  const autoTweenRef = useRef(null);
  const isActiveRef = useRef(true);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setHalf(el.clientWidth / 2);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyRotation = () => {
    if (cubeRef.current) {
      gsap.set(cubeRef.current, {
        rotateX: rotationRef.current.x,
        rotateY: rotationRef.current.y,
      });
    }
  };

  const setShadowIntensity = (level) => {
    gsap.to(shadowRef.current, {
      opacity: level === 0 ? 0.75 : 1,
      scale: level === 0 ? 1 : 1.22,
      filter: `blur(${level === 0 ? 60 : 78}px)`,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const scheduleRandomRotate = () => {
    if (!isActiveRef.current) return;
    const dx = gsap.utils.random(-30, 30);
    const dy = gsap.utils.random(70, 150) * (Math.random() < 0.5 ? -1 : 1);
    autoTweenRef.current = gsap.to(rotationRef.current, {
      x: rotationRef.current.x + dx,
      y: rotationRef.current.y + dy,
      duration: gsap.utils.random(RANDOM_MIN_DUR, RANDOM_MAX_DUR),
      ease: "sine.inOut",
      onUpdate: applyRotation,
      onComplete: scheduleRandomRotate,
    });
  };

  const stopAutoRotate = () => {
    if (autoTweenRef.current) {
      autoTweenRef.current.kill();
      autoTweenRef.current = null;
    }
    gsap.killTweensOf(rotationRef.current);
  };

  const returnToInitialThenResume = () => {
    stopAutoRotate();
    gsap.to(rotationRef.current, {
      x: 0,
      y: 0,
      duration: RETURN_DURATION,
      ease: "power3.out",
      onUpdate: applyRotation,
      onComplete: scheduleRandomRotate,
    });
  };

  useEffect(() => {
    isActiveRef.current = true;
    scheduleRandomRotate();
    return () => {
      isActiveRef.current = false;
      stopAutoRotate();
    };
  }, []);

  const onPointerDown = (e) => {
    stopAutoRotate();
    setShadowIntensity(1);
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      fromX: rotationRef.current.x,
      fromY: rotationRef.current.y,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    rotationRef.current.y = dragState.current.fromY + dx * 0.5;
    rotationRef.current.x = dragState.current.fromX - dy * 0.5;
    applyRotation();
  };

  const endDrag = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    setShadowIntensity(0);
    returnToInitialThenResume();
  };

  const onPointerUp = () => endDrag();
  const onPointerLeave = () => endDrag();
  const onPointerEnter = () => {
    if (!dragState.current.dragging) setShadowIntensity(1);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 14, duration: 0.5 })
        .from("[data-hero-word]", { opacity: 0, y: 40, stagger: 0.08, duration: 0.7 }, "-=0.2")
        .from("[data-hero-sub]", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3")
        .from("[data-hero-cta]", { opacity: 0, y: 16, duration: 0.5 }, "-=0.4");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    try {
      async function getProduct() {
        let data = await axios.get(`${API_ORIGIN}/api/v1/product/allActiveProduct`);
        setProduct(data.data.products);
      }
      getProduct();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${API_ORIGIN}/api/v1/product/allCategory`);
        const list = (response.data.allCategory || []).map((category) => category.name);
        setCategories(list);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-ink text-white">
        <Container className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:py-28">
          {/* Text content — 50% */}
          <div>
            <p data-hero-eyebrow className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
              New season, new drops
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              <span className="block overflow-hidden">
                <span data-hero-word className="block">Everyday gear,</span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-word className="block text-brand-400">designed with intent.</span>
              </span>
            </h1>
            <p data-hero-sub className="mt-6 max-w-md text-white/60">
              Curated tech and lifestyle products from makers who obsess over the details, so you don't have to.
            </p>
            <div data-hero-cta className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="flex h-12 items-center gap-2 rounded-full bg-brand-400 px-6 text-sm font-semibold text-ink transition hover:bg-brand-300">
                Shop the collection <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/5">
                Explore categories
              </Link>
            </div>
          </div>

          {/* Image content — 50%, interactive full 6-face 3D cube */}
          <div className="flex justify-center">
            <div
              ref={stageRef}
              className="relative w-40 aspect-square cursor-grab touch-none select-none active:cursor-grabbing sm:w-52 md:w-60 lg:w-64 xl:w-72"
              style={{ perspective: 1400 }}
              onPointerDown={onPointerDown}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
            >
              <div
                ref={shadowRef}
                className="pointer-events-none absolute -inset-10 rounded-full sm:-inset-14 lg:-inset-16"
                style={{
                  opacity: 0.75,
                  filter: "blur(48px)",
                  background:
                    "conic-gradient(from 120deg, rgba(124,58,237,0.75), rgba(6,182,212,0.7), rgba(244,63,94,0.7), rgba(245,158,11,0.7), rgba(124,58,237,0.75))",
                }}
              />

              <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
                <div ref={cubeRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                  {FACE_CONFIG.map((face, i) => (
                    <div
                      key={face.key}
                      className="absolute inset-0 overflow-hidden border border-white/10"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: face.transform(half),
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {faces[i] ? (
                        <img
                          src={faces[i]}
                          alt=""
                          draggable={false}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-white/5" />
                      )}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{ backgroundColor: `rgba(0,0,0,${face.shade})` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured products */}
      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">Handpicked</p>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Featured products</h2>
            </div>
            <Link to="/products" className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block">
              View all →
            </Link>
          </div>

          <div ref={productRef} className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4">
            {product.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-16">
        <Container>
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">Search by</p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Categories products</h2>
          </div>
          <div ref={categoryRef} className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                data-reveal
                className="group overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
              >
                <div className="flex flex-col items-center justify-center px-4 py-4 transition-colors duration-500 group-hover:bg-black/10">
                  <h3 className="font-display text-2xl md:text-4xl font-bold capitalize text-gray-900 transition-colors duration-500">
                    {cat}
                  </h3>
                  <span className="mt-4 text-sm font-medium text-gray-600 transition-colors duration-500">
                    View All
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <About></About>
    </div>
  );
}