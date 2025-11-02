import React from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyCart() {
  // Mock cart items
  const cartItems = [
    { id: 1, title: "Wireless Headphones", price: 89.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
    { id: 2, title: "Smart Watch", price: 199.99, quantity: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-[#2E2E38] mb-1 border-b-2 border-[#5EE177] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
          My Cart
        </h1>
        <p className="text-sm text-[#60656F] mt-2">{cartItems.length} items</p>
      </div>

      {/* Cart Items */}
      <div className="px-6 space-y-4 mb-8">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 border border-[#E4E8ED] shadow-sm">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#2E2E38] mb-1">{item.title}</h3>
                <p className="text-lg font-bold text-[#5EE177] mb-2">${item.price}</p>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full bg-[#E4E8ED] flex items-center justify-center hover:bg-[#5EE177] hover:text-white transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-semibold text-[#2E2E38] w-8 text-center">{item.quantity}</span>
                  <button className="w-7 h-7 rounded-full bg-[#E4E8ED] flex items-center justify-center hover:bg-[#5EE177] hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button className="text-[#60656F] hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#E4E8ED] shadow-sm">
          <h2 className="text-lg font-bold text-[#2E2E38] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Order Summary
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#60656F]">Subtotal</span>
              <span className="font-semibold text-[#2E2E38]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#60656F]">Tax</span>
              <span className="font-semibold text-[#2E2E38]">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-[#E4E8ED] pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold text-[#2E2E38]">Total</span>
                <span className="font-bold text-xl text-[#5EE177]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Button className="w-full h-12 bg-gradient-to-r from-[#5EE177] to-[#FF8AC6] hover:opacity-90 font-bold rounded-2xl">
            Proceed to Checkout
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {cartItems.length === 0 && (
        <div className="px-6">
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E4E8ED]">
            <ShoppingCart className="w-16 h-16 text-[#60656F] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#2E2E38] mb-2">Your cart is empty</h3>
            <p className="text-[#60656F] text-sm">Start shopping to add items to your cart</p>
          </div>
        </div>
      )}
    </div>
  );
}