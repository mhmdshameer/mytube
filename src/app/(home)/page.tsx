import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <div>
      <Image src="/logo.svg" alt="logo" width={50} height={50} />
      <p className="text-xl font-semibold tracking-tight">MyTube</p>
    </div>
  );
}
