import Splitting from 'splitting';
import 'splitting/dist/splitting.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o Splitting para dividir o texto da About Us
  Splitting();

  const textBack = document.querySelector('#about-us .text-back');
  
  if (textBack) {
    // Seleciona todos os caracteres (Splitting pode criar spans com classe "char")
    const chars = textBack.querySelectorAll('.char');

    // Cria uma timeline para a animação do texto e o fade-out da About Us
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about-us",
        start: "top top",
        end: "+=200%", // ajuste este valor conforme a duração desejada para a animação
        scrub: true,
        pin: true,
        pinSpacing: false,
      }
    });

    // Animação de entrada dos caracteres (scale de 0 para 1)
    tl.fromTo(chars,
      {
        scaleY: 0,
        transformOrigin: '50% 100%'
      },
      {
        scaleY: 1,
        ease: "power3.in",
        stagger: 0.05,
      }
    );

    // Ao final, faz um fade-out suave da seção About Us, liberando a entrada da What We Do
    tl.to("#about-us", { opacity: 0, duration: 1 });
  }
});
