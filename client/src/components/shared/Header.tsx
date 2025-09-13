"use client"
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import authStore from "@/store/auth.store";
import {useRouter} from "next/navigation";

const Header = () => {
    const {setTheme} = useTheme()
    const {logout} = authStore()
    const router = useRouter()
    return <nav className={"top-header"}>This is header
        <ThemeSwitcher/>
        <Button onClick={() => {
            setTheme("light")
            router.push("/login")
            logout()
        }}> Logout</Button>
    </nav>
}
export default Header;