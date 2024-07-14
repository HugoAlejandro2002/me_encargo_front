// Sidebar.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Asegúrate de crear un archivo de estilo para el Sidebar
import boxIcon from '../../src/assets/boxIcon.svg';
import sellerIcon from '../../src/assets/sellersIcon.svg'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="hamburger" onClick={toggleSidebar}>
                &#9776; {/* Icono de hamburguesa */}
            </button>
            <div className="menu-items">
                <Link to="/product">
                    <img src={boxIcon} alt='Inventario' className='icon text-white'/>
                    {isOpen && <span>Inventario</span>}
                </Link>
                <Link to="/seller">
                    <img src={sellerIcon} alt='Vendedores' className='icon'/>
                    {isOpen && <span>Vendedores</span>}
                </Link>
                {/* TODO: agregar rutas de a poco... */}
            </div>
        </div>
    );
};

export default Sidebar;
