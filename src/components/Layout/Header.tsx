import React, { useState } from 'react';

interface MenuItem {
  id: number;
  label: string;
  link: string;
}

interface HeaderProps {
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  { id: 1, label: 'Home', link: '#home' },
  { id: 2, label: 'Services', link: '#services' },
  { id: 3, label: 'Gallery', link: '#gallery' },
  { id: 4, label: 'About', link: '#about' },
  { id: 5, label: 'Contact', link: '#contact' }
];

const Header: React.FC<HeaderProps> = ({ menuItems = defaultMenuItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      setIsMenuOpen(false);
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="header">
        <a href="#home" className="logo" onClick={handleMenuClick}>
          Shambala Homes
        </a>
        <button
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="menu-text">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </header>

      <div className={`fullpage-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="menu-content">
          <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a href={item.link} onClick={handleMenuClick}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* removed duplicate close button - header toggle handles open/close */}
        </div>
      </div>
    </>
  );
};

export default Header;
