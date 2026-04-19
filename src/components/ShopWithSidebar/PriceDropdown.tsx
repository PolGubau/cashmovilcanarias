import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Slider } from 'radix-ui';
import { useState } from 'react';

const PriceDropdown = () => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const [selectedPrice, setSelectedPrice] = useState({
    from: 0,
    to: 100,
  });

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5"
      >
        <p className="text-dark">Price</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setToggleDropdown(!toggleDropdown)}
          aria-label="Expandir precio"
          className={`text-dark w-6 h-6 hover:bg-transparent hover:text-dark ease-out duration-200 ${toggleDropdown ? "rotate-180" : ""}`}
        >
          <ChevronDown className="size-6" />
        </Button>
      </div>

      {/* // <!-- dropdown menu --> */}
      <div className={`p-6 ${toggleDropdown ? 'block' : 'hidden'}`}>
        <div id="pricingOne">
          <div className="price-range">
            <Slider.Root
              className="relative flex items-center w-full h-5 mb-3 select-none touch-none"
              defaultValue={[0, 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) =>
                setSelectedPrice({
                  from: Math.floor(values[0]),
                  to: Math.ceil(values[1]),
                })
              }
            >
              <Slider.Track className="relative grow rounded-full h-[4px] bg-blue/20">
                <Slider.Range className="absolute rounded-full h-full bg-blue" />
              </Slider.Track>
              <Slider.Thumb className="block w-[18px] h-[18px] bg-white border-2 border-blue rounded-full shadow hover:bg-blue/10 focus:outline-none focus:ring-2 focus:ring-blue/40 cursor-pointer" aria-label="Precio mínimo" />
              <Slider.Thumb className="block w-[18px] h-[18px] bg-white border-2 border-blue rounded-full shadow hover:bg-blue/10 focus:outline-none focus:ring-2 focus:ring-blue/40 cursor-pointer" aria-label="Precio máximo" />
            </Slider.Root>

            <div className="price-amount flex items-center justify-between pt-4">
              <div className="text-custom-xs text-dark-4 flex rounded border border-gray-3/80">
                <span className="block border-r border-gray-3/80 px-2.5 py-1.5">
                  $
                </span>
                <span id="minAmount" className="block px-3 py-1.5">
                  {selectedPrice.from}
                </span>
              </div>

              <div className="text-custom-xs text-dark-4 flex rounded border border-gray-3/80">
                <span className="block border-r border-gray-3/80 px-2.5 py-1.5">
                  $
                </span>
                <span id="maxAmount" className="block px-3 py-1.5">
                  {selectedPrice.to}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDropdown;
