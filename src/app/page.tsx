import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <div className="font-bold text-2xl text-red-500">
      <Image src="/logo.svg" alt="logo" width={50} height={50} />
    </div>
  );
}
