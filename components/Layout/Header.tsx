import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "./ContextWrapper";

const Header = () => {
  const router = useRouter();
  const [inform, setInform] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const handleToggle = (): void => {
    setToggleMenu(!toggleMenu);
  };
  const logOut = (): void => {
    router.push("/account/signin");
  };

  return (
    <header>
      <div className="px-4 py-2 text-white flex  justify-between bg-blue-900">
        <h1>LOGO</h1>
        <div
          className={
            toggleMenu
              ? "md:flex  md:pt-0 pt-10 w-full md:w-auto"
              : "hidden md:flex"
          }
          id="menu"
        >
          <ul>
            <li className="md:inline-block cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3">
              <Link href="/blogs">Blogs</Link>
            </li>
          </ul>
        </div>
        <div>
          {currentUser && (
            <span className="py-2 px-2 md:border-none" data-cy="username">
              {currentUser?.name}
            </span>
          )}
          {currentUser ? (
            <button
              className="py-2 md:border-none bg-gray-400 text-color-dark rounded"
              data-cy="logout"
              onClick={() => logOut()}
            >
              logout
            </button>
          ) : (
            <>
              <Link href="/account/signin">
                <span className="py-2 md:border-none cursor-pointer hover:text-gray-500">
                  Login
                </span>
              </Link>
              <Link href="/account/signup">
                <span className="py-2 px-2 md:border-none cursor-pointer hover:text-gray-500">
                  Register
                </span>
              </Link>
            </>
          )}
        </div>
        <div className="cursor-pointer md:hidden">
          <input className="menu-btn hidden" type="checkbox" id="menu-btn" />
          <label
            className="menu-icon block cursor-pointer md:hidden px-2 py-4 relative select-none"
            htmlFor="menu-btn"
          >
            <span
              onClick={handleToggle}
              className="navicon bg-white-darkest flex items-center relative"
            ></span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;
