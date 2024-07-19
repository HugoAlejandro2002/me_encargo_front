import { Routes, Route } from 'react-router-dom';
import Product from '../pages/Product/Product';
import Seller from '../pages/Seller/Seller';
import Sales from '../pages/Sales/Sales';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/product" element={<Product />} />
      <Route path="/seller" element={<Seller />} />
      <Route path='/sales' element = {<Sales/>}/>
    </Routes>
  );
};

export default AppRoutes;
