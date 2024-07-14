import { Input } from 'antd';
import './Header.css';
import logoImg from '../../../src/assets/logo.png';
const { Search } = Input;

const Header = () => {
    return (
        <div className="app-header">
            <div className="left-section">
                <img src={logoImg} alt='logo' className='logo' />
                <h1 className='text-black'>ME ENCARGO</h1>
            </div>

            <Search
                placeholder="Buscar"
                onSearch={value => console.log(value)}
                style={{ width: 400 }}
            />

            <div className="header-icons">
            </div>
        </div>
    );
};

export default Header;
