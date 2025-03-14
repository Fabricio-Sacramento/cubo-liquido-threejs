// src/components/TransitionOverlay.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import vertexShader from "../shaders/transition.vert.glsl";
import fragmentShader from "../shaders/transition.frag.glsl";

gsap.registerPlugin(ScrollTrigger);

const TransitionOverlay = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const uniformsRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 🎥 Configuração da Cena
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    );
    camera.position.z = 1;

    // 🔹 Criando um plano para cobrir a tela
    const geometry = new THREE.PlaneGeometry(width, height);

    // 🔹 Uniformes para controlar o efeito de transição
    uniformsRef.current = {
      progress: { value: 0.0 },
      count: { value: 15.0 }, // Quantidade de listras
      smoothness: { value: 0.5 },
      resolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 🔹 Configuração do Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 🎬 Loop de renderização
    const render = () => {
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(render);
    };
    render();

    // 🌀 ScrollTrigger para ativar a transição
    const trigger = ScrollTrigger.create({
      trigger: "#about-us",
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        uniformsRef.current.progress.value = self.progress;
      },
    });

    // 📏 Redimensionamento da tela
    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      uniformsRef.current.resolution.value.set(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", onResize);
      trigger.kill();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    />
  );
};

export default TransitionOverlay;
