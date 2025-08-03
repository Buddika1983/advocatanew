"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchFooterMenu = async () => {
      const res = await fetch(
        "https://bpheadlessb418.wpenginepowered.com/graphql",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetFooterMenu {
                menu(id: "footer", idType: LOCATION) {
                  menuItems {
                    nodes {
                      id
                      label
                      url
                      parentId
                    }
                  }
                }
              }
            `,
          }),
        }
      );

      const json = await res.json();
      const items = json?.data?.menu?.menuItems?.nodes || [];
      setMenuItems(items);
    };

    fetchFooterMenu();
  }, []);

  const topLevelItems = menuItems.filter((item) => item.parentId === null);
  const getChildren = (parentId) =>
    menuItems.filter((item) => item.parentId === parentId);

  return (
    <footer className="bg-[#101010] text-white pt-12 pb-8 px-4 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Dynamic Menu Columns */}
        {topLevelItems.map((parent) => {
          const children = getChildren(parent.id);

          if (
            parent.label.toLowerCase() === "dashboards" &&
            children.length > 0
          ) {
            const halfway = Math.ceil(children.length / 2);
            const col1 = children.slice(0, halfway);
            const col2 = children.slice(halfway);

            return (
              <div key={parent.id}>
                <h4 className="font-semibold text-base mb-4 relative">
                  <span className="border-t-2 border-[#DF4879] absolute top-0 left-0 w-6"></span>
                  <span className="pl-8">{parent.label}</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    {col1.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.url}
                          className="text-gray-400 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2">
                    {col2.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.url}
                          className="text-gray-400 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          }

          return (
            <div key={parent.id}>
              <h4 className="font-semibold text-base mb-4 relative">
                <span className="border-t-2 border-[#DF4879] absolute top-0 left-0 w-6"></span>
                <span className="pl-8">{parent.label}</span>
              </h4>
              <ul className="space-y-2">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={child.url}
                      className="text-gray-400 hover:text-white"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Newsletter */}
        <div className="border border-gray-600 p-6 rounded">
          <div className="flex justify-between items-start mb-4">
            <svg
              className="w-5 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="none"
            >
              <path
                d="M2 4C2 2.89543 2.89543 2 4 2H20.4167C21.5212 2 22.4167 2.89543 22.4167 4V16.3333C22.4167 17.4379 21.5212 18.3333 20.4167 18.3333H4C2.89543 18.3333 2 17.4379 2 16.3333V4Z"
                stroke="#F5ACC9"
                strokeWidth="2.04167"
                strokeLinejoin="round"
              />
              <path
                d="M20.7151 6.76392L13.0665 10.6615C12.8069 10.7821 12.5121 10.8456 12.2119 10.8456C11.9118 10.8456 11.617 10.7821 11.3574 10.6615L3.70117 6.76392"
                stroke="#F5ACC9"
                strokeWidth="2.04167"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="border-t-2 border-[#DF4879] w-6"></span>
          </div>
          <h4 className="font-semibold text-base mb-2">
            Newsletter Subscription
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            Get exclusive economic insights and data analysis delivered to your
            inbox from Advocata's research team.
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              name="email-address"
              id="email-address"
              autoComplete="email"
              required
              className="footer-subscribe-input px-3 py-2 rounded text-black"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="bg-[#A5273F] text-white py-2 rounded hover:bg-[#8f2237]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-16 border-t border-white pt-11 sm:mt-20 md:mt-24 md:flex md:items-center md:justify-between">
        <div className="pl-3 mt-3 mb-11 md:my-0">
          <div className="flex justify-center md:justify-start gap-x-12">
            {/* Icons */}
            <a href="#" className="footer-social-link">
              <span className="sr-only">Facebook</span>
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
              >
                <g opacity="0.6">
                  <path
                    d="M15.75 2.58325H13.125C11.9647 2.58325 10.8519 3.04419 10.0314 3.86466C9.21094 4.68513 8.75 5.79793 8.75 6.95825V9.58325H6.125V13.0833H8.75V20.0833H12.25V13.0833H14.875L15.75 9.58325H12.25V6.95825C12.25 6.72619 12.3422 6.50363 12.5063 6.33953C12.6704 6.17544 12.8929 6.08325 13.125 6.08325H15.75V2.58325Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </a>
            <a href="#" className="footer-social-link">
              <span className="sr-only">X</span>
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
              >
                <g opacity="0.6">
                  <path
                    d="M15.9634 2.802H18.8579L12.5343 10.0295L19.9735 19.8645H14.1487L9.58642 13.8996L4.36617 19.8645H1.46992L8.23367 12.1339L1.09717 2.802H7.06992L11.1938 8.25413L15.9634 2.802ZM14.9475 18.132H16.5514L6.19842 4.4435H4.47729L14.9475 18.132Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </a>
            <a href="#" className="footer-social-link">
              <span className="sr-only">YouTube</span>
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="15"
                viewBox="0 0 20 15"
                fill="none"
              >
                <g opacity="0.6">
                  <path
                    d="M1 5.15014C1 2.94101 2.79086 1.15015 5 1.15015H14.5419C16.751 1.15015 18.5419 2.94101 18.5419 5.15015V9.51648C18.5419 11.7256 16.751 13.5165 14.5419 13.5165H5C2.79086 13.5165 1 11.7256 1 9.51647V5.15014Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.30908 8.87918L11.9636 7.33339L8.30908 5.7876V8.87918Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </a>
            <a href="#" className="footer-social-link">
              <span className="sr-only">Linked In</span>
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <g opacity="0.6">
                  <path
                    d="M14.542 7.83325C15.9344 7.83325 17.2697 8.38638 18.2543 9.37094C19.2389 10.3555 19.792 11.6909 19.792 13.0833V19.2083H16.292V13.0833C16.292 12.6191 16.1076 12.174 15.7794 11.8458C15.4512 11.5176 15.0061 11.3333 14.542 11.3333C14.0779 11.3333 13.6327 11.5176 13.3046 11.8458C12.9764 12.174 12.792 12.6191 12.792 13.0833V19.2083H9.29199V13.0833C9.29199 11.6909 9.84512 10.3555 10.8297 9.37094C11.8142 8.38638 13.1496 7.83325 14.542 7.83325Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.79199 8.70825H2.29199V19.2083H5.79199V8.70825Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.04199 6.08325C5.00849 6.08325 5.79199 5.29975 5.79199 4.33325C5.79199 3.36675 5.00849 2.58325 4.04199 2.58325C3.07549 2.58325 2.29199 3.36675 2.29199 4.33325C2.29199 5.29975 3.07549 6.08325 4.04199 6.08325Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </a>
            <a href="#" className="footer-social-link">
              <span className="sr-only">Instagram</span>
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <g opacity="0.6">
                  <path
                    d="M1.54199 5.58325C1.54199 3.37411 3.33285 1.58325 5.54199 1.58325H15.042C17.2511 1.58325 19.042 3.37411 19.042 5.58325V15.0833C19.042 17.2924 17.2511 19.0833 15.042 19.0833H5.54199C3.33285 19.0833 1.54199 17.2924 1.54199 15.0833V5.58325Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.2085 9.87385C13.2985 10.4807 13.1949 11.1005 12.9123 11.645C12.6298 12.1896 12.1827 12.6311 11.6347 12.9069C11.0867 13.1828 10.4657 13.2788 9.86004 13.1813C9.25435 13.0838 8.69481 12.7979 8.26101 12.3641C7.82722 11.9303 7.54125 11.3707 7.44378 10.7651C7.34632 10.1594 7.44232 9.53836 7.71814 8.99038C7.99396 8.44239 8.43554 7.99533 8.98008 7.71278C9.52462 7.43023 10.1444 7.32657 10.7512 7.41656C11.3702 7.50835 11.9433 7.79679 12.3858 8.23928C12.8283 8.68177 13.1167 9.25485 13.2085 9.87385Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.3022 6.32275H14.3095"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </a>
          </div>
        </div>
        <div className="pr-3">
          <ul className="grid md:flex gap-3.5 md:gap-12 text-center md:text-start">
            <li>
              <a href="#" className="text-slate-50/60 hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-50/60 hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-slate-50/60 text-xs px-3">
        <p>&copy; 2025 Advocata, Inc. All rights reserved.</p>
        <p className="mt-3.5 md:mt-0">Site built by ODDLY</p>
      </div>
    </footer>
  );
}
