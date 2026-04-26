import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/notice', label: 'Notice Board' },
    { to: '/contact', label: 'Contact' },
  ];

  const contactItems = [
    { icon: <Phone size={14} />, label: 'Phone', value: '+880 421 714 220' },
    { icon: <Mail size={14} />, label: 'Email', value: 'hall.admin@just.edu.bd' },
    { icon: <MapPin size={14} />, label: 'Location', value: 'JUST, Jashore-7408, Bangladesh' },
  ];

  return (
    <footer id="main-footer" className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-8 border-b border-white/15">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-sm">
                <img
                  src="/logo.png"
                  alt="JUST Logo"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div>
                <p className="text-lg font-bold font-heading leading-tight">
                  JUST HallSync
                </p>
                <p className="text-[11px] text-white/50 tracking-widest uppercase">
                  Est. 2007
                </p>
              </div>
            </div>
            <p className="text-sm text-white/65 leading-relaxed max-w-xs mb-5">
              Comprehensive residential services and facilities for students
              across all halls at Jashore University of Science and Technology.
            </p>
            <div className="flex gap-2">
              <a
                href="https://www.just.edu.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="JUST Website"
              >
                <Globe size={15} className="text-white/80" />
              </a>
              <a
                href="mailto:hall.admin@just.edu.bd"
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={15} className="text-white/80" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-white/45 tracking-widest uppercase mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {navLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/75 hover:text-white transition-colors flex items-center gap-2 no-underline"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-white/45 tracking-widest uppercase mb-4">
              Contact
            </p>
            <div className="space-y-4">
              {contactItems.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/75">
                    {icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 mb-0.5">{label}</p>
                    <p className="text-sm text-white/80 leading-snug">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-5">
          <p className="text-xs text-white/40">
            © {currentYear} Jashore University of Science and Technology. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/contact"
              className="text-xs text-white/40 hover:text-white/75 transition-colors no-underline"
            >
              Support
            </Link>
            <Link
              to="/notice"
              className="text-xs text-white/40 hover:text-white/75 transition-colors no-underline"
            >
              Notices
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;