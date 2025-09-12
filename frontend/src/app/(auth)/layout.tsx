export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <section>
            {/* Layout UI */}
            {/* Place children where you want to render a page or nested layout */}
            <main className="">
                {children}
            </main>
        </section>
    )
}