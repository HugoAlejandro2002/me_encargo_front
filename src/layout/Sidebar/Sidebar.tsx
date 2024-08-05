import { Link } from 'react-router-dom';
import './Sidebar.css';
import boxIcon from '../../../src/assets/boxIcon.svg';
import sellerIcon from '../../../src/assets/sellersIcon.svg';
import cartIcon from '../../../src/assets/cartIcon.svg';
import shippingIcon from '../../../src/assets/shippingIcon.svg';
import financeFluxIcon from '../../../src/assets/financeFluxIcon.svg';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button
                className="text-light-blue text-2xl p-4 bg-transparent hover:bg-light-blue/10 self-start"
                onClick={toggleSidebar}
            >
                &#9776; {/* Icono de hamburguesa */}
            </button>
            <div className="flex flex-col ">
                <Link to="/product" className='flex items-center p-4 hover:bg-light-blue/10'>
                    <img src={boxIcon} alt='Inventario' className='w-6 h-6 mx-3' />
                    {isOpen && <span className='ml-2'>Inventario</span>}
                </Link>
                <Link to="/seller" className='flex items-center p-4 hover:bg-light-blue/10'>
                    <img src={sellerIcon} alt='Vendedores' className='w-6 h-6 mx-3' />
                    {isOpen && <span className='ml-2'>Vendedores</span>}
                </Link>
                <Link to="/sales" className='flex items-center p-4 hover:bg-light-blue/10'>
                    <img src={cartIcon} alt='Ventas' className='w-6 h-6 mx-3' />
                    {isOpen && <span className='ml-2'>Ventas</span>}
                </Link>
                <Link to="/shipping" className='flex items-center p-4 hover:bg-light-blue/10'>
                    <img src={shippingIcon} alt='Pedidos' className='w-6 h-6 mx-3' />
                    {isOpen && <span className='ml-2'>Pedidos</span>}
                </Link>
                <Link to="/financeFlux" className='flex items-center p-4 hover:bg-light-blue/10'>
                    <img src={financeFluxIcon} alt='Flujo Financiero' className='w-6 h-6 mx-3' />
                    {isOpen && <span className='ml-2'>Pedidos</span>}
                </Link>
                <Link to="/stock" className='flex items-center p-4 hover:bg-light-blue/10'>
                    <img src={financeFluxIcon} alt='Stock' className='w-6 h-6 mx-3' />
                    {isOpen && <span className='ml-2'>Stock</span>}
                </Link>
                {/* TODO: agregar más enlaces... */}
            </div>
        </div>
    );
};

export default Sidebar;
