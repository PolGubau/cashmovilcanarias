import { Button } from "@/components/ui/button";
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
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
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
