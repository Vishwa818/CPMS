import React, { useEffect, useRef, useState } from 'react';
import Logo from '../../assets/CPMS.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function LandingNavbar() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [buttonSize, setButtonSize] = useState('lg');
  const [logoText, setLogoText] = useState('College Placement Management System');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setButtonSize('sm');
        setLogoText('CPMS');
      } else if (width <= 768) {
        setButtonSize('md');
        setLogoText('College Placement Management System');
      } else {
        setButtonSize('lg');
        setLogoText('College Placement Management System');
      }
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const staffLinks = [
    { label: 'Login as TPO', path: '/tpo/login', color: 'text-orange-600' },
    { label: 'Login as Management', path: '/management/login', color: 'text-blue-700' },
    { label: 'Login as Recruiter', path: '/recruiter/login', color: 'text-indigo-600' },
  ];

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'backdrop-blur-md bg-white/60 shadow-md sticky top-0' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center py-3 px-4">
        {/* Logo Section */}
        <div
          className="flex items-center max-md:gap-2 md:gap-4 cursor-pointer transition-transform hover:scale-105 duration-150"
          onClick={() => navigate('/')}
        >
          <img
            src={Logo}
            alt="CPMS Logo"
            className="rounded-xl border border-gray-300 w-16 h-16 md:w-20 md:h-20 shadow-sm"
          />
          <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            {logoText}
          </h1>
        </div>

        {/* Button Section */}
        <div className="flex max-md:gap-1 md:gap-3 items-center">
          {/* Student Login */}
          <Button
            variant="outline-primary"
            size={buttonSize}
            className="transition-all hover:scale-105 hover:shadow-md px-3 md:w-28"
            onClick={() => navigate('/student/login')}
          >
            Login
          </Button>

          {/* Student Sign Up */}
          <Button
            variant="success"
            size={buttonSize}
            className="transition-all hover:scale-105 hover:shadow-md px-3 md:w-28"
            onClick={() => navigate('/student/signup')}
          >
            Sign Up
          </Button>

          {/* Staff Login Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline-secondary"
              size={buttonSize}
              className="transition-all hover:scale-105 hover:shadow-md px-3 md:w-36 flex items-center gap-1"
              onClick={() => setDropdownOpen((prev) => !prev)}
              id="staffLoginBtn"
            >
              Staff Login
              <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                {staffLinks.map(({ label, path, color }) => (
                  <button
                    key={path}
                    className={`w-full text-left px-4 py-3 text-sm font-medium ${color} hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-none`}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(path);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;

