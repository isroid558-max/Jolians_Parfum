import { Route, Routes } from "react-router-dom"
import Menu from "./components/menu"
import Home from "./pages/Home"
import Product from "./pages/product"
import About from "./pages/About"
import ProductDetail from "./pages/ProductDetail"
import Checkout from "./pages/Checkout"
import NotFound from "./pages/NotFound"
import Keranjang from "./pages/Keranjang"
import ParfumBadan from "./pages/ParfumBadan"
import ParfumLaundry from "./pages/ParfumLaundry"
import Admin from "./pages/Admin"
import Logout from "./pages/Logout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import SuperAdmin from "./pages/SuperAdmin"


function App() {

  return (
    <>
      <Menu/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/product" element={<Product/>}/>
      <Route path="/produk/:id" element={<ProductDetail/>}/>
      <Route path="/About" element={<About/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/Keranjang" element={<Keranjang/>}/>
      <Route path="/parfum-badan" element={<ParfumBadan/>}/>
      <Route path="/parfum-laundry" element={<ParfumLaundry/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/super-admin" element={<SuperAdmin/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/logout" element={<Logout/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </>
  )
}

export default App
