import Image from "next/image";
import React from "react";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Envío gratuito",
    description: "En pedidos superiores a 200€",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "Devoluciones fáciles",
    description: "Cancelación en 24 horas",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "Pago 100% seguro",
    description: "Transacciones protegidas",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "Soporte 24/7",
    description: "Siempre disponibles",
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex flex-wrap items-center gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item) => (
          <div className="flex items-center gap-4" key={item.title}>
            <Image src={item.img} alt="icons" width={40} height={41} />

            <div>
              <h3 className="font-medium text-lg text-dark">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
