import React, { useState, useEffect, useContext, createContext } from 'react';
import { ShoppingCart, Plus, Minus, Star, Clock, MapPin, Phone } from 'lucide-react';

// Context for cart management
const CartContext = createContext();

// Custom hook for cart functionality
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Sample vegetarian menu data
const menuData = {
  appetizers: [
    { id: 1, name: "Paneer Tikka", price: 299, description: "Grilled cottage cheese with mint chutney", image: "🧀", rating: 4.5, prepTime: "10-15 min" },
    { id: 2, name: "Vegetable Spring Rolls", price: 249, description: "Crispy rolls with mixed vegetables and sweet chili sauce", image: "🥟", rating: 4.7, prepTime: "8-12 min" },
    { id: 3, name: "Stuffed Mushrooms", price: 279, description: "Button mushrooms stuffed with herbs and cheese", image: "🍄", rating: 4.3, prepTime: "12-15 min" },
    { id: 4, name: "Aloo Chat", price: 199, description: "Spiced potato chat with tamarind and mint chutney", image: "🥔", rating: 4.6, prepTime: "5-8 min" }
  ],
  mains: [
    { id: 5, name: "Paneer Butter Masala", price: 449, description: "Creamy tomato curry with cottage cheese", image: "🍛", rating: 4.8, prepTime: "15-20 min" },
    { id: 6, name: "Dal Makhani", price: 399, description: "Rich black lentils cooked with butter and cream", image: "🫘", rating: 4.9, prepTime: "20-25 min" },
    { id: 7, name: "Vegetable Biryani", price: 379, description: "Fragrant basmati rice with mixed vegetables and spices", image: "🍚", rating: 4.6, prepTime: "25-30 min" },
    { id: 8, name: "Palak Paneer", price: 429, description: "Cottage cheese in creamy spinach gravy", image: "🥬", rating: 4.7, prepTime: "15-18 min" },
    { id: 9, name: "Chole Bhature", price: 329, description: "Spiced chickpeas with fluffy fried bread", image: "🫓", rating: 4.5, prepTime: "12-15 min" },
    { id: 10, name: "Vegetable Korma", price: 399, description: "Mixed vegetables in coconut and cashew gravy", image: "🥥", rating: 4.4, prepTime: "18-22 min" }
  ],
  desserts: [
    { id: 11, name: "Gulab Jamun", price: 149, description: "Sweet milk dumplings in rose syrup", image: "🍯", rating: 4.7, prepTime: "Ready to serve" },
    { id: 12, name: "Ras Malai", price: 179, description: "Soft cottage cheese dumplings in sweet milk", image: "🥛", rating: 4.8, prepTime: "Ready to serve" },
    { id: 13, name: "Kulfi", price: 129, description: "Traditional Indian ice cream with cardamom", image: "🍦", rating: 4.5, prepTime: "Ready to serve" },
    { id: 14, name: "Gajar Halwa", price: 159, description: "Sweet carrot pudding with nuts and ghee", image: "🥕", rating: 4.6, prepTime: "Ready to serve" }
  ]
};

// Header Component
const Header = () => {
  const { getTotalItems, setIsCartOpen } = useCart();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🍽️ Vistara</h1>
            <div className="hidden sm:flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Mumbai</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>02225631199</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// Menu Item Component
const MenuItem = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-3xl">{item.image}</span>
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{item.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{item.prepTime}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
          <button
            onClick={() => addToCart(item)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Menu Section Component
const MenuSection = ({ title, items }) => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

// Cart Modal Component
const CartModal = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, isCartOpen, setIsCartOpen } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert('Order placed successfully! 🎉');
      setIsCheckingOut(false);
      setIsCartOpen(false);
    }, 2000);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <span className="text-2xl">{item.image}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-orange-600 font-medium">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const RestaurantApp = () => {
  const [activeSection, setActiveSection] = useState('appetizers');

  // useEffect for smooth scrolling when section changes
  useEffect(() => {
    const section = document.getElementById(activeSection);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">Welcome to Vistara</h1>
            <p className="text-xl sm:text-2xl mb-8">Authentic Indian cuisine</p>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.keys(menuData).map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-6 py-3 rounded-lg font-semibold capitalize transition-colors ${
                    activeSection === section
                      ? 'bg-white text-orange-500'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Sections */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div id="appetizers">
            <MenuSection title="Appetizers" items={menuData.appetizers} />
          </div>
          <div id="mains">
            <MenuSection title="Main Courses" items={menuData.mains} />
          </div>
          <div id="desserts">
            <MenuSection title="Desserts" items={menuData.desserts} />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg mb-4">🍽️ Vistara Restaurant</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Mumbai</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>0222563119
                
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Mon-Sun: 11AM - 11PM</span>
              </div>
            </div>
          </div>
        </footer>

        <CartModal />
      </div>
    </CartProvider>
  );
};

export default RestaurantApp;