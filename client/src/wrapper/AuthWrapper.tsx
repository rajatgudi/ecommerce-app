import Header from "@/components/shared/Header";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Footer from "@/components/shared/Footer";
import React from "react";

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({
                                                                  children,
                                                              }) => {
    return <>
        {/* Header */}
        <Header/>
        <main className="flex flex-row">
            {/* Left Sidebar */}
            <LeftSidebar/>
            <section className="main-container  ">
                <div className="w-full max-w-4xl ">
                    {children}
                </div>
            </section>
            {/* Right Sidebar */}
            <RightSidebar/>
        </main>
        {/* Footer */}
        <Footer/></>
}
export default AuthWrapper;