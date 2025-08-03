'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Header() {
    const [menuItems, setMenuItems] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchMenu = async () => {
            const res = await fetch('https://bpheadlessb418.wpenginepowered.com/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
            query GetMainMenu {
              menu(id: "main-menu", idType: SLUG) {
                menuItems {
                  nodes {
                    id
                    label
                    url
                    path
                    parentId
                    childItems {
                      nodes {
                        id
                        label
                        url
                        path
                      }
                    }
                  }
                }
              }
            }
          `,
                }),
            });

            const json = await res.json();
            const items = json?.data?.menu?.menuItems?.nodes || [];
            setMenuItems(items);
        };

        fetchMenu();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const topLevelItems = menuItems.filter(item => !item.parentId);

    return (
        <header className="navbar header fixed top-0 z-50 w-full border-b border-slate-200 backdrop-blur-xl transition-all">
            <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
                {/* Logo */}
                <div className="shrink-0">
                    <Link href="/" className="text-xl font-semibold font-family-playfair text-slate-900">
                        <img src="/images/brand-logo.png" alt="Advocata Logo" className="inline-block h-8 w-auto mr-2 align-middle" />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="hidden gap-6 md:flex md:items-center">
                    {topLevelItems.map((item) => {
                        const hasChildren = item.childItems?.nodes?.length > 0;
                        const isOpen = openDropdown === item.id;

                        if (hasChildren) {
                            return (
                                <div key={item.id} className="relative" ref={openDropdown === item.id ? dropdownRef : null}>
                                    <button
                                        onClick={() =>
                                            setOpenDropdown(isOpen ? null : item.id)
                                        }
                                        className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
                                    >
                                        {item.label}
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>

                                    {isOpen && (
                                        <div className="absolute left-0 mt-2 w-44 rounded-md bg-white shadow-lg z-50">
                                            {item.childItems.nodes.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    href={child.path || child.url}
                                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                    onClick={() => setOpenDropdown(null)} // close dropdown on item click
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.id}
                                href={item.path || item.url}
                                className="text-sm font-medium text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile menu icon (optional) */}
                <div className="md:hidden">
                    {/* Add hamburger toggle if needed */}
                </div>
            </div>
        </header>
    );
}
