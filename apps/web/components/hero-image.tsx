"use client";

import HeroDark from "@/public/hero-dark.svg";
import Hero from "@/public/hero.svg";
import Image from "next/image";

export default function HeroImage() {
  return (
    <>
      {/* ライトモード用画像 */}
      <Image
        src={Hero}
        alt="Logo"
        priority
        className="block dark:hidden"
      />
      {/* ダークモード用画像 */}
      <Image
        src={HeroDark}
        alt="Logo"
        priority
        className="hidden dark:block"
      />
    </>
  );
}
