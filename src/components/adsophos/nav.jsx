import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './adsophos.css'

const Nav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lastScrollY = useRef(0);

    // Disable body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isMenuOpen]);

    useEffect(() => {
        const SCROLL_DELTA = 6;

        const handleScroll = () => {
            const currentScrollY = Math.max(
                0,
                window.pageYOffset || document.documentElement.scrollTop || 0
            );
            const delta = currentScrollY - lastScrollY.current;

            // Handle scroll background/contrast (same as before)
            if (currentScrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Safari-safe visibility logic: ignore tiny jitter/bounce deltas.
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (delta > SCROLL_DELTA) {
                if (!isMenuOpen) setIsVisible(false);
            } else if (delta < -SCROLL_DELTA) {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        lastScrollY.current = Math.max(
            0,
            window.pageYOffset || document.documentElement.scrollTop || 0
        );

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMenuOpen]);

    const menuVariants = {
        closed: {
            x: '100%',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
        open: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0 },
    };

    return (
        <>
            <div 
                style={
                    isScrolled && isVisible
                        ? {
                              backgroundColor: 'rgba(0, 0, 0, 0.72)',
                              borderBottomColor: 'rgba(255, 255, 255, 0.10)',
                          }
                        : undefined
                }
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out ${
                    isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                } ${
                    isScrolled && isVisible
                    ? 'border-b text-white py-2 shadow-2xl' 
                    : 'bg-transparent text-[#1e1e1e] py-0'
                }`}
            >
                <nav className='max-w-7xl mx-auto px-6 md:px-12 py-4 md:py-4 transition-all duration-500'>
                    <div className={`up flex justify-between items-center border-b-[0.5px] transition-colors duration-500 pb-4 mb-4 ${
                        isScrolled ? 'border-white/20' : 'border-[#1e1e1e]'
                    }`}>
                        <div className="logo cursor-pointer hover:opacity-80 transition-opacity">
                            <img 
                                src="/logoad.png" 
                                alt="Logo" 
                                className={`h-10 md:h-16 transition-all duration-500 ${isScrolled ? 'brightness-0 invert' : ''}`} 
                            />
                        </div>
                        

                        <div className="lg:hidden">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`p-2 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`}
                                aria-label="Toggle menu"
                            >
                                <div className="w-6 h-5 flex flex-col justify-between items-end">
                                    <span className={`h-0.5 bg-current transition-all duration-300 rounded-full ${isMenuOpen ? 'w-full translate-y-2.5 rotate-45' : 'w-full'}`} />
                                    <span className={`h-0.5 bg-current transition-all duration-300 rounded-full ${isMenuOpen ? 'opacity-0 w-0' : 'w-4/5'}`} />
                                    <span className={`h-0.5 bg-current transition-all duration-300 rounded-full ${isMenuOpen ? 'w-full -translate-y-2.5 -rotate-45' : 'w-1/2'}`} />
                                </div>
                            </button>
                        </div>

                        <div className="links hidden lg:flex">
                            <ul className='flex gap-10 justify-center items-center font-medium'>
                                <li><a href="/" className="hover:text-red-500 transition-colors">Home</a></li>
                                <li><a href="/techfaceoff" className="hover:text-red-500 transition-colors">Tech Face-off</a></li>
                                <li><a href="/events" className="hover:text-red-500 transition-colors">Events</a></li>
                                <li><a href="/team-page" className="hover:text-red-500 transition-colors">Team</a></li>
                                <li><a href="/gallery" className="hover:text-red-500 transition-colors">Gallery</a></li>
                                <li><a href="/contact" className="hover:text-red-500 transition-colors">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="down hidden lg:flex justify-between items-center transition-all duration-500">
                        <ul className='flex gap-4 md:gap-6'> 
                            <li><a href="#" className="hover:scale-110 transition-transform"><img src="/Instagram.svg" alt="Instagram" className={isScrolled ? "invert opacity-80" : ""} /></a></li>
                            <li><a href="#" className="hover:scale-110 transition-transform"><img src="/GitHub.svg" alt="GitHub" className={isScrolled ? "invert opacity-80" : ""} /></a></li>
                            <li><a href="#" className="hover:scale-110 transition-transform"><img src="/LinkedIn.svg" alt="LinkedIn" className={isScrolled ? "invert opacity-80" : ""} /></a></li>
                            <li><a href="#" className="hover:scale-110 transition-transform"><img src="/YouTube.svg" alt="YouTube" className={isScrolled ? "invert opacity-80" : ""} /></a></li>
                        </ul>
                        <div className="register">
                            <button className="btn2 text-sm md:text-md font-medium hover:scale-105 transition-transform active:scale-95 px-6 py-2">Join Us</button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-[110] bg-[#000000] lg:hidden overflow-y-auto"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#ff00a2]/10 blur-[120px] pointer-events-none rounded-full" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#2bdde1]/5 blur-[100px] pointer-events-none rounded-full" />

                        <motion.div className="relative flex flex-col h-full px-8 py-10 z-10">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-16">
                                <motion.div variants={itemVariants} className="logo flex items-center gap-4">
                                    <img src="/logoad.png" alt="Logo" className="h-8 brightness-0 invert" />
                                </motion.div>
                                <motion.button 
                                    variants={itemVariants}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="group active:scale-90 transition-transform"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">Close</span>
                                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                                            <div className="w-4 h-4 relative">
                                                <span className="w-full h-0.5 bg-white absolute top-1/2 left-0 rotate-45" />
                                                <span className="w-full h-0.5 bg-white absolute top-1/2 left-0 -rotate-45" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            </div>

                            {/* Menu Links */}
                            <motion.ul className="flex flex-col gap-6 text-4xl font-black text-white mb-16 adsophos-container">
                                {[
                                    { name: 'Home', path: '/' },
                                    { name: 'Tech Face-off', path: '/techfaceoff' },
                                    { name: 'Events', path: '/events' },
                                    { name: 'Team', path: '/team-page' },
                                    { name: 'Gallery', path: '/gallery' },
                                    { name: 'Contact Us', path: '/contact' },
                                ].map((item) => (
                                    <motion.li 
                                        key={item.name}
                                        variants={itemVariants}
                                        whileHover={{ x: 10, color: '#ff00a2' }}
                                        className="transition-colors border-b border-white/5 last:border-0 pb-4"
                                    >
                                        <a 
                                            href={item.path} 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="uppercase tracking-tighter"
                                        >
                                            {item.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </motion.ul>

                            {/* Mobile Register Button */}
                            <motion.div variants={itemVariants} className="mb-16">
                                <button className="btn2 w-full py-5 text-xl uppercase font-black shadow-[0_0_30px_rgba(255,0,162,0.3)]" onClick={() => setIsMenuOpen(false)}>
                                    Register Now
                                </button>
                            </motion.div>

                            {/* Social Links Footer */}
                            <motion.div 
                                variants={itemVariants}
                                className="mt-auto"
                            >
                                <div className="flex flex-col items-center gap-6">
                                    <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black">Join Our Community</p>
                                    <ul className="flex gap-10 justify-center">
                                        {['Instagram', 'GitHub', 'LinkedIn', 'YouTube'].map((social) => (
                                            <li key={social}>
                                                <a href="#" className="hover:scale-125 transition-transform inline-block group">
                                                    <img src={`/${social}.svg`} alt={social} className="w-6 h-6 invert opacity-50 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Nav