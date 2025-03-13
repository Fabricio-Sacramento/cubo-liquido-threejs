import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Configura o ScrollTrigger para fixar a seção About Us
  ScrollTrigger.create({
    trigger: "#about-us",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
    // markers: true, // Ativar para depurar
  });

  // Animação para revelar letra por letra no texto da frente,
  // alterando o clip-path de cada span de "inset(0 0 100% 0)" para "inset(0 0 0 0)"
  gsap.to(".text-front .line span", {
    clipPath: "inset(0 0 0 0)",
    duration: 1,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#about-us",
      start: "top top",
      end: "bottom top",
      scrub: true,
      // markers: true, // Ativar para depurar
    }
  });
});
