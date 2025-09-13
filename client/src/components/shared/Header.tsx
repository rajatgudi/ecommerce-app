"use client"
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import authStore from "@/store/auth.store";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {ArrowLeftStartOnRectangleIcon} from "@heroicons/react/16/solid";

const Header = () => {
    const {setTheme} = useTheme()
    const {logout} = authStore()
    const router = useRouter()
    return <nav className={"top-header"}>
        <Link href={"/"}>
            <h2 className={"text-blue-800 text-2xl ml-2 font-bold"}>LOGO</h2>
        </Link>
        <div className={"flex flex-row gap-x-2 items-center"}>
            <ThemeSwitcher/>
            <Button size={"sm"} variant={"outline"} className={"items-center"} onClick={() => {
                setTheme("light")
                router.push("/login")
                logout()
            }}><ArrowLeftStartOnRectangleIcon/> </Button>

        </div>

    </nav>
}
export default Header;