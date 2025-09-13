import AuthWrapper from "@/wrapper/AuthWrapper";

interface ProtectedRootLayoutProps {
    children: React.ReactNode;
}

const ProtectedRootLayout = ({children}: ProtectedRootLayoutProps) => {
    return (
        <AuthWrapper>{children}</AuthWrapper>
    );
};

export default ProtectedRootLayout;