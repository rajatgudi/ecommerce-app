import axios, {AxiosRequestHeaders} from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
})

//Attach tokens from zustand store
api.interceptors.request.use(
    (config: any) => {
        try {
            // TODO: get real token from the auth store if needed
            const token = "";
            if (token !== "") {

                const headers: AxiosRequestHeaders = {
                    ...(config.headers as AxiosRequestHeaders),
                    Authorization: `Bearer ${token}`,
                };
                config.headers = headers;
            }
        } catch (e) {
            console.error(e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api