import { Link } from "react-router-dom";
import { navItems } from "@/nav-items";

const Navbar = () => {
  return (
    <nav className="bg-background text-primary border-b border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold hacker-glow">CryptoHack Market</Link>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center px-3 py-2 rounded-md hover:bg-secondary hover:text-accent transition-colors hacker-border"
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
