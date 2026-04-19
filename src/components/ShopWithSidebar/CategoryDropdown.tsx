"use client";

import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const CategoryItem = ({ category }) => {
  const [selected, setSelected] = useState(false);
  return (
    <Button
      variant="ghost"
      onClick={() => setSelected(!selected)}
      className={`w-full justify-between p-0 h-auto font-normal hover:bg-transparent group ${selected ? "text-blue" : ""} hover:text-blue`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded size-4 border ${selected ? "border-blue bg-blue" : "bg-white border-gray-3"
            }`}
        >
          <Check className={`size-2.5 text-white ${selected ? "block" : "hidden"}`} strokeWidth={2.5} />
        </div>

        <span>{category.name}</span>
      </div>

      <span
        className={`${selected ? "text-white bg-blue" : "bg-gray-2"
          } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {category.products}
      </span>
    </Button>
  );
};

const CategoryDropdown = ({ categories }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && "shadow-filter"
          }`}
      >
        <p className="text-dark">Category</p>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Expandir categorías"
          className={`text-dark w-6 h-6 hover:bg-transparent hover:text-dark ease-out duration-200 ${toggleDropdown ? "rotate-180" : ""}`}
        >
          <ChevronDown className="size-6" />
        </Button>
      </div>

      {/* dropdown && 'shadow-filter */}
      {/* <!-- dropdown menu --> */}
      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${toggleDropdown ? "flex" : "hidden"
          }`}
      >
        {categories.map((category, key) => (
          <CategoryItem key={key} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
