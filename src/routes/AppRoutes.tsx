import { Routes, Route } from 'react-router-dom';
import Product from '../pages/Product/Product';
import Seller from '../pages/Seller/Seller';
import Sales from '../pages/Sales/Sales';
import Shipping from '../pages/Shipping/Shipping';
import FinanceFlux from '../pages/FinanceFlux/FinanceFlux';
import StockManagement from '../pages/StockManagement/StockManagement';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/product" element={<Product />} />
      <Route path="/seller" element={<Seller />} />
      <Route path='/sales' element={<Sales />} />
      <Route path='/shipping' element={<Shipping />} />
      <Route path='/financeFlux' element={<FinanceFlux />} />
      <Route path='/stock' element={<StockManagement/>}/>
      
    </Routes>
  );
};

export default AppRoutes;
