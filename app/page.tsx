"use client";
import Image from "next/image";
import styles from "@/styles/main.module.scss";
import { useEffect } from "react";
import initPlanet3D from "@/components/3D/planet";
export default function Home() {

  useEffect(() => {
    const { scene, renderer } = initPlanet3D();
    return () => {
      if(renderer){
        const gl = renderer.getContext();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        renderer.dispose();
      }
    }
  }, []);

  return (
    <div className="page">
      <section className="hero_main">

        <div className="content">
          <h1> Welcome to 3D Planet!
            </h1>
            <p>
              Explore the wonders of our solar system in stunning 3D. Discover the planets, moons, and other celestial bodies that make up our cosmic neighborhood. With interactive models and detailed information, you can learn about the unique features and characteristics of each planet. Whether you're a student, educator, or simply a space enthusiast, 3D Planet offers an immersive experience to deepen your understanding of our universe. Start your journey through space today!
            </p>
            <button className="cta_btn">Explore Now</button>
        </div>

        <canvas className="planet-3D" />
      </section>
    </div>
  );
}
