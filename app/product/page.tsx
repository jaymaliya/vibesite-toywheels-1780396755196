"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const allProducts = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Maisto Chevrolet Camaro SS RS 1:24 Die-Cast Model Car",
    description: "Vibrant lemon yellow Chevrolet Camaro die-cast model with iconic black racing stripes.",
    price: 299,
    specs: [
      { label: "Scale", value: "1:24" },
      { label: "Material", value: "Die-cast metal with plastic parts" },
      { label: "Color", value: "Yellow with black racing stripes" },
      { label: "Doors", value: "Opening doors" },
      { label: "Recommended Age", value: "3+ years" },
    ],
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Centy Toys Mahindra Thar Die-Cast Model Car",
    description: "Vibrant red, detailed die-cast Mahindra Thar SUV model for collectors.",
    price: 399,
    specs: [
      { label: "Scale", value: "1:36 approx" },
      { label: "Material", value: "Die-cast metal with plastic parts" },
      { label: "Color", value: "Red with black accents" },
      { label: "Features", value: "Pull-back action" },
      { label: "Recommended Age", value: "3+ years" },
    ],
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Centy Toys Tata Nexon Die-Cast Model Car",
    description: "Highly detailed Tata Nexon die-cast model car, perfect for collectors and enthusiasts.",
    price: 499,
    specs: [
      { label: "Scale", value: "1:36 approx" },
      { label: "Material", value: "Die-cast metal with plastic parts" },
      { label: "Color", value: "Blue with black dual-tone roof" },
      { label: "Features", value: "Pull-back action" },
      { label: "Recommended Age", value: "3+ years" },
    ],
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Welly Lamborghini Aventador LP 700-4 1:24 Die-Cast Model Car",
    description: "Highly detailed metallic papaya orange Lamborghini Aventador LP 700-4 die-cast model.",
    price: 599,
    specs: [
      { label: "Scale", value: "1:24" },
      { label: "Material", value: "Die-cast metal with plastic parts" },
      { label: "Color", value: "Orange with black wheels" },
      { label: "Doors", value: "Opening scissor-style doors" },
      { label: "Recommended Age", value: "3+ years" },
    ],
  },
];

const reviews = [
  { name: "Arjun M.", date: "12 Jan 2025", rating: 5, text: "Absolutely stunning detail on the Camaro. The racing stripes are crisp, the doors open smoothly, and the alloy wheels look like the real thing. Worth every rupee for a collector." },
  { name: "Priya R.", date: "03 Mar 2025", rating: 5, text: "Bought this as a gift for my husband who's a die-hard Camaro fan. He was blown away by the quality. The lemon yellow finish under the light is mesmerizing." },
  { name: "Rohan K.", date: "28 Feb 2025", rating: 4, text: "Great model car. Excellent detail work. Packaging was good too. Only minor issue: one door hinge feels slightly loose, but overall very happy with the purchase." },
  { name: "Meera S.", date: "15 Feb 2025", rating: 5, text: "As a serious collector, I have high standards. This Camaro exceeded them. The proportions are accurate, the paint job is flawless, and it feels premium. Definitely recommending to friends." },
  { name: "Vikram P.", date: "08 Feb 2025", rating: 4, text: "Solid die-cast model. Good weight, feels durable. The wheels roll smoothly. Would have preferred a display stand, but the model itself is perfect." },
];

const colors = ["Yellow", "Silver", "Black", "Red"];
const sizes = ["1:24 Standard"];

function ProductDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [activeTab, setActiveTab] = useState("specs");
  const mainImageRef = useRef(null);

  const paramImg = searchParams.get("img");
  const paramName = searchParams.get("name") ?? "Product";
  const paramPrice = searchParams.get("price");

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayPrice = paramPrice ? parseInt(paramPrice) : 299;

  const handleAddToCart = () => {
    addToCart({
      id: Date.now(),
      name: paramName,
      price: displayPrice,
      quantity: quantity,
      image: displayImg,
      color: selectedColor,
      size: selectedSize,
    });
    alert("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-full bg-white rounded-lg shadow-lg p-4 mb-4">
              <img
                ref={mainImageRef}
                src={displayImg}
                alt="Product"
                className="w-full h-96 object-contain"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {allProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => router.push(`/product?img=${product.img}&name=${encodeURIComponent(product.name)}&price=${product.price}`)}
                  className="border-2 border-gray-300 rounded p-2 hover:border-blue-500 transition"
                >
                  <img src={product.img} alt={product.name} className="w-16 h-16 object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{paramName}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-gray-600">(187 reviews)</span>
            </div>

            <div className="text-4xl font-bold text-blue-600 mb-6">₹{displayPrice.toLocaleString()}</div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded border-2 transition ${
                        selectedColor === color
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
                <div className="flex gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border-2 transition ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition mb-4"
            >
              Add to Cart
            </button>

            <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition">
              Buy Now
            </button>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex gap-6 mb-6">
            {["specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-semibold pb-2 border-b-2 transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "specs" && (
            <div className="space-y-4">
              {allProducts[0].specs.map((spec, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">{spec.label}</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.name}</h4>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}