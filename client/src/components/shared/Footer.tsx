"use client"
import {sideBarIcons} from "@/constants";
import {sideBarIconsTypes} from "@/types/menu.types";
import {usePathname} from "next/navigation";
import Link from "next/link";

const Footer = () => {
    const pathName = usePathname();
    return (<section className={"bottom-footer"}>
        <div className={"bottombar_container"}>
            {sideBarIcons.map((link: sideBarIconsTypes) => {
                const isActive =
                    (pathName.includes(link.route) && link.route.length > 1) ||
                    pathName === link.route;
                return (<Link
                    href={link.route}
                    key={link.label}
                    className={`bottombar_link ${
                        isActive && "font-bold bg-gray-100 dark:bg-gray-800"
                    }`}
                >
                    <link.Icon
                        className={`h-6 w-6 ${isActive && "dark:text-white font-bold"}`}
                    />
                    <div className={`max-lg:hidden text-dark-1`}>{link.label}</div>
                </Link>)
            })}
        </div>
    </section>)
}
export default Footer;