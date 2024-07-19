import { Routes, Route } from 'react-router-dom';
import Product from '../pages/Product/Product';
import Seller from '../pages/Seller/Seller';
import Sale from '../pages/Sale/Sale';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/product" element={<Product />} />
      <Route path="/seller" element={<Seller />} />
      <Route path="/sale" element={<Sale/>} />
    </Routes>
  );
};

export default AppRoutes;
