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
            <button className="hamburger" onClick={toggleSidebar}>
                &#9776; {/* Icono de hamburguesa */}
            </button>
            <div className="menu-items">
                <Link to="/product">
                    <img src={boxIcon} alt='Inventario' className='icon' />
                    {isOpen && <span>Inventario</span>}
                </Link>
                <Link to="/seller">
                    <img src={sellerIcon} alt='Vendedores' className='icon' />
                    {isOpen && <span>Vendedores</span>}
                </Link>
                {/* TODO: agregar más enlaces... */}
            </div>
        </div>
    );
};

export default Sidebar;
