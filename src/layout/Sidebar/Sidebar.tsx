import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { menu } from "../../constants/menu";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(UserContext)!;

  const filteredMenuItems = menu.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button
        className="text-light-blue text-2xl p-4 bg-transparent hover:bg-light-blue/10 self-start"
        onClick={toggleSidebar}
      >
        &#9776;
      </button>
      <div className="flex flex-col">
        {filteredMenuItems.map((item) => (
          <Link
            to={item.path}
            className="flex items-center p-4 hover:bg-light-blue/10"
            key={item.path}
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6 mx-3" />
            {isOpen && <span className="ml-2">{item.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
