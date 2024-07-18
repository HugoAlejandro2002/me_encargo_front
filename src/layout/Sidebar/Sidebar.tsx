import { Link } from 'react-router-dom';
import './Sidebar.css';
import boxIcon from '../../../src/assets/boxIcon.svg';
import sellerIcon from '../../../src/assets/sellersIcon.svg';

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
                <Link to="/seller"className='flex items-center p-4 hover:bg-light-blue/10'>
                    <img src={sellerIcon} alt='Vendedores' className='w-6 h-6 mx-3' />
                    {isOpen && <span className='ml-2'>Vendedores</span>}
                </Link>
                {/* TODO: agregar más enlaces... */}
            </div>
        </div>
    );
};

export default Sidebar;
