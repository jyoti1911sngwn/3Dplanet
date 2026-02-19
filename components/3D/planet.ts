import gsap from "gsap";
import * as THREE from "three";
import earthVertex from "@/components/3D/shaders/earth/vertex.glsl";
import earthFragment from "@/components/3D/shaders/earth/fragment.glsl";
import atmosphereVertex from "@/components/3D/shaders/atmosphere/vertex.glsl";
import atmosphereFragment from "@/components/3D/shaders/atmosphere/fragment.glsl";
import { Scroll } from "@react-three/drei";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

const initPlanet3D = (): {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
} => {
  const canvas = document.querySelector(
    "canvas.planet-3D",
  ) as HTMLCanvasElement;

  //scene
  const scene = new THREE.Scene();

  //camera
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
  };
  const camera = new THREE.PerspectiveCamera(
    15,
    size.width / size.height,
    0.1,
    1000,
  );
  camera.position.x = 0;
  // camera.position.y = 0.1;
  // camera.position.z = 19;
  camera.position.y = 2.15;
  camera.position.z = 4.5;
  scene.add(camera);
  //renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(size.pixelRatio);
  renderer.setClearColor(0xffffff, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  //texture
  const TL = new THREE.TextureLoader();
  const dayTexture = TL.load("/earth/day.jpg");
  const nightTexture = TL.load("/earth/night.jpg");
  const spectacularCloudsTexture = TL.load("/earth/spectacularClouds.jpg");

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  spectacularCloudsTexture.colorSpace = THREE.SRGBColorSpace;

  const baseAnisotropy = renderer.capabilities.getMaxAnisotropy();
  dayTexture.anisotropy = baseAnisotropy;
  nightTexture.anisotropy = baseAnisotropy;
  spectacularCloudsTexture.anisotropy = baseAnisotropy;

  //3js Objects - geometry and material
  const textureLoader = new THREE.TextureLoader();
  const atmosphereDayColor = "#4a96e8";
  const atmosphereTwilightColor = "#1950E5";

  const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    uniforms: {
      uDayTexture: new THREE.Uniform(dayTexture),
      uNightTexture: new THREE.Uniform(nightTexture),
      uSpectacularCloudsTexture: new THREE.Uniform(spectacularCloudsTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(new THREE.Color(atmosphereDayColor)),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(new THREE.Color(atmosphereTwilightColor)),
      ),
    },

    transparent: true,
  });

  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      uOpacity: { value: 1 },
      uDayTexture: new THREE.Uniform(dayTexture),
      uNightTexture: new THREE.Uniform(nightTexture),
      uSpectacularCloudsTexture: new THREE.Uniform(spectacularCloudsTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(new THREE.Color(atmosphereDayColor)),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(new THREE.Color(atmosphereTwilightColor)),
      ),
    },

    depthWrite: false,
  });
  const atmosphereGeometry = new THREE.SphereGeometry(2.0, 64, 64);
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  atmosphere.scale.set(1.13, 1.13, 1.13);

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  const earthGroup = new THREE.Group().add(earth, atmosphere);
  let sunSpherical = new THREE.Spherical(1, Math.PI * 0.48, -1.8);
  const sunDirection = new THREE.Vector3();

  sunDirection.setFromSpherical(sunSpherical);
  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);

  scene.add(earthGroup);

  //animation loop

gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero_main",
    start: "top top",
    end: "bottom top",
    scrub: 2,
    pin: true,
  },
});

// 📝 TEXT → blur + disappear
tl.to(".hero_main .content", {
  filter: "blur(40px)",
  autoAlpha: 0,
  y: -80,
  scale: 0.8,
  duration: 1,
  ease: "power2.out",
}, 0);

// 🌍 PLANET → move up
tl.to(earthGroup.position, {
  y: 6,              // move up
  duration: 1,
  ease: "power3.out",
}, 0);

// 🌍 PLANET → zoom far away
tl.to(camera.position, {
  z: 18,             // huge zoom out
  y: 6,
  duration: 1,
  ease: "power3.out",
}, 0);

// 🌍 PLANET → shrink more
tl.to(earthGroup.scale, {
  x: 0.85,
  y: 0.85,
  z: 0.85,
  duration: 1,
  ease: "power2.out",
}, 0);


  gsap.ticker.add((time) => {
    earth.rotation.y = time * 0.2;
    renderer.render(scene, camera);
  });
  gsap.ticker.lagSmoothing(0);

  window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    size.pixelRatio = window.devicePixelRatio;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRatio);
  });

  return { scene, renderer };
};

export default initPlanet3D;
