"use client"
import {sideBarIcons} from "@/constants";
import Link from "next/link";
import {sideBarIconsTypes} from "@/types/menu.types";
import {usePathname} from "next/navigation";

const LeftSidebar = () => {
    const pathName = usePathname()
    return <section className={"custom-scrollbar leftsidebar"}>

        <div className={"flex w-full flex-1 flex-col gap-6 px-6"}>
            {sideBarIcons.map((link: sideBarIconsTypes) => {
                const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route
                return (<Link href={link.route} key={link.route}
                              className={`leftsidebar_link ${isActive && 'font-bold dark:bg-gray-800 bg-gray-100'}`}>
                    <link.Icon
                        className={`h-6 w-6 ${isActive && "dark:text-white text-dark-1 font-bold"}`}>
                        <div className={`max-lg:hidden text-dark-1 dark:text-light-2 `}>{link.label}</div>
                    </link.Icon>

                </Link>)

            })}
        </div>
    </section>;
}
export default LeftSidebar