export function parseTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken) {
        // Clean URL (remove token)
        const url = new URL(window.location.href);
        url.searchParams.delete('accessToken');
        window.history.replaceState({}, document.title, url.toString());
    }
    if (refreshToken) {
        // Clean URL (remove token)
        const url = new URL(window.location.href);
        url.searchParams.delete('refreshToken');
        window.history.replaceState({}, document.title, url.toString());
    }

    return {accessToken, refreshToken};
}