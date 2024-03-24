/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import {Link} from "@nextui-org/link";

import {siteConfig} from "@/config/site";
import NextLink from "next/link";

import {ThemeSwitch} from "@/components/theme-switch";
import {GithubIcon} from "@/components/icons";
import ModalLogin from "./modal-login";
import {Avatar} from "@nextui-org/avatar";

import {useCookies} from "react-cookie";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faDollarSign,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {User} from "@/types/user.type";
import {useRouter} from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const [cookie, _, removeCookies] = useCookies();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    removeCookies("user");
  };

  useEffect(() => {
    setUser(cookie?.user || null);
  }, [cookie]);

  return (
    <NextUINavbar maxWidth="xl">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">Neubook</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex">
          {user ? (
            <div className="flex items-center justify-center gap-x-5">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faDollarSign} />
                <p>{+user.point}</p>
              </div>
              <Avatar isBordered name={user.username} />
              <FontAwesomeIcon
                className="cursor-pointer "
                icon={faCartShopping}
                onClick={() => {
                  router.push("/orders");
                }}
              />
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="text-red-600 cursor-pointer hover:text-red-400"
                onClick={handleLogout}
              />
            </div>
          ) : (
            <ModalLogin />
          )}
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.github} aria-label="Github">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
