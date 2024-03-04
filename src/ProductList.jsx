import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import axiosInstance from "./api/axiosInstance";
const productPerPage = 10;

export default function ProductList() {
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(0);
  const [hasmore, setHasmore] = useState(true);
  const loaderRef = useRef();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axiosInstance.get(
          `/products?limit=${productPerPage}&skip=${page * productPerPage}`
        );
        const data = response.data;
        if (data.products.length === 0) {
          setHasmore(false);
        } else {
          setProduct((prevproducts) => [...prevproducts, ...data.products]);
          setPage((prevpage) => prevpage + 1);
        }
      } catch (error) {
        console.error("error:", error);
      }
    };
    const onIntersection = (items) => {
      const loaderItem = items[0];
      if (loaderItem.isIntersecting && hasmore) {
        getProducts();
      }
    };
    const observer = new IntersectionObserver(onIntersection);
    if (observer && loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    //cleanup
    return () => {
      if (observer) observer.disconnect();
    };
  });
  return (
    <div className="flex flex-col place-items-center">
      <h1>Product list</h1>
          {product.map((product) => <ProductCard
             title={product.title} price={product.price} thumbnail={product.thumbnail} key={product.id} />)}
      {hasmore&&<p ref={loaderRef}>Loading more products...</p>}
    </div>
  );
}
