import { Input } from "antd";
import "./Header.css";
import logoImg from "../../../public/logo.png";

const { Search } = Input;

const HeaderXS = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-blue h-16 border-light-gray">
      <button
        className="text-white text-2xl p-2 rounded-full bg-blue hover:bg-light-blue/80 flex items-center justify-center mr-4"
        onClick={toggleSidebar}
      >
        &#9776;
      </button>
      <img src={logoImg} alt="logo" className="w-10 h-auto" />
      <div className="ml-auto">
        <Search placeholder="Buscar" className="max-w-xs" style={{ width: 200 }} />
      </div>
    </div>
  );
};

export default HeaderXS;
