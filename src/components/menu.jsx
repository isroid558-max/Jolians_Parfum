import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 font-sans">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-1 group">
          <span className="text-gray-800 group-hover:text-pink-600 transition-colors">Jolians</span>
          <span className="text-pink-500">Parfum</span>
        </Link>

        {/* Navigation & Icons Wrapper */}
        <div className="flex items-center gap-6 sm:gap-8">
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-pink-500 font-medium transition-colors">Home</Link>
            
            {/* Dropdown Product */}
            <div className="relative">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-gray-600 hover:text-pink-500 font-medium transition-colors focus:outline-none"
              >
                Product
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>

              {isOpen && (
                <div className="absolute top-full right-0 md:left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col animate-fade-in z-50">
                   <Link to="/parfum-badan" className="px-4 py-3 hover:bg-pink-50 text-left flex items-center gap-3 transition-colors border-b border-gray-50" onClick={() => setIsOpen(false)}>
                      <div className="bg-pink-100 p-2 rounded-lg text-pink-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">Parfum Body</div>
                        <div className="text-xs text-gray-500">Wangi tahan lama</div>
                      </div>
                   </Link>
                   <Link to="/parfum-laundry" className="px-4 py-3 hover:bg-pink-50 text-left flex items-center gap-3 transition-colors" onClick={() => setIsOpen(false)}>
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2.873 1.108a.5.5 0 0 1 .627.272l.412 1.152 1.152.412a.5.5 0 0 1 0 .942l-1.152.412-.412 1.152a.5.5 0 0 1-.942 0l-.412-1.152-1.152-.412a.5.5 0 0 1 0-.942l1.152-.412.412-1.152a.5.5 0 0 1 .272-.627zM9.5 6.5a3 3 0 0 0-2.83 2H1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-5.67a3 3 0 0 0-2.83-2zM2 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/></svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">Parfum Laundry</div>
                        <div className="text-xs text-gray-500">Segar & bersih</div>
                      </div>
                   </Link>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-600 hover:text-pink-500 font-medium transition-colors">About</Link>
            {isAuthenticated ? (
              <Link to="/logout" className="text-gray-600 hover:text-pink-500 font-medium transition-colors">Logout</Link>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-pink-500 font-medium transition-colors">Login</Link>
            )}
          </nav>

          {/* Icons Section */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-pink-500 transition-colors p-1"
                title="Cari Produk"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white p-2 rounded-xl shadow-xl border border-gray-100 animate-fade-in w-64 z-50">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari produk..." 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-pink-400 w-full"
                    />
                    <button type="submit" className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                      </svg>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link to="/Keranjang" className="text-gray-600 hover:text-pink-500 transition-colors relative p-1" title="Keranjang">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Menu;
