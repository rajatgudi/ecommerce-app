import {sideBarIconsTypes} from "@/types/menu.types";
import {HeartIcon, HomeIcon, PlusCircleIcon, ShoppingCartIcon, UserIcon} from "@heroicons/react/24/outline";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";


export const sideBarIcons: sideBarIconsTypes[] = [
    {
        Icon: HomeIcon,
        label: "Home",
        route: "/",
        imgUrl: "",
    },
    {
        Icon: MagnifyingGlassIcon,
        label: "Search",
        route: "/search",
        imgUrl: "",
    },
    {
        Icon: ShoppingCartIcon,
        label: "Cart",
        route: "/cart",
        imgUrl: "",
    },
    {
        Icon: HeartIcon,
        label: "Notifications",
        route: "/notifications",
        imgUrl: "",
    },
    {
        Icon: PlusCircleIcon,
        label: "Create",
        route: "/create",
        imgUrl: "",
    },
    {
        Icon: UserIcon,
        label: "Profile",
        route: "/profile",
        imgUrl: "s",
    },
];