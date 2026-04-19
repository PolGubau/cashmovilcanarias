"use client";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import type { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/** Dispatches cart clear once on mount — used after successful payment. */
export function ClearCartOnMount() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(removeAllItemsFromCart());
  }, [dispatch]);
  return null;
}
