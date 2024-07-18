import { Input } from 'antd';
import './Header.css';
import logoImg from '../../../src/assets/logo.png';
const { Search } = Input;

const Header = () => {
    return (
        <div className="flex justify-between items-center p-5 bg-blue h-16 border-light-blue border-light-gray">
            <div className="flex items-center">
                <img src={logoImg} alt='logo' className='w-10 h-auto' />
                <h1 className="ml-4 text-2xl text-light-blue font-bold">ME ENCARGO</h1>
            </div>

            <Search
                placeholder="Buscar"
                onSearch={value => console.log(value)}
                className='flex-grow max-w-xl mx-5'
                style={{ width: 400 }}
            />

            <div className="flex items-center">
            </div>
        </div>
    );
};

export default Header;
