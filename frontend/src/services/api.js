import axios from "axios";

const api = axios.create({

    baseURL:
    "http://localhost:8000/api/v1",

    withCredentials:true

});

api.interceptors.request.use(

    (config)=>{

        const token =
        localStorage.getItem(
            "token"
        );

        if(token){

            config.headers.Authorization =

            `Bearer ${token}`;

        }

        return config;

    }

);

api.interceptors.response.use(

    response => response,

    async(error)=>{

        const originalRequest =
        error.config;

        if(

            error.response?.status === 401 &&

            !originalRequest._retry

        ){

            originalRequest._retry = true;

            try{

                const refreshResponse =

                await axios.post(

                    "http://localhost:8000/api/v1/users/refresh-token",

                    {},

                    {
                        withCredentials:true
                    }

                );

                const newToken =

                refreshResponse.data
                .accessToken;

                localStorage.setItem(

                    "token",

                    newToken

                );

                originalRequest.headers.Authorization =

                `Bearer ${newToken}`;

                return api(
                    originalRequest
                );

            }
            catch(err){

                localStorage.clear();

                window.location.href =
                "/login";

            }

        }

        return Promise.reject(
            error
        );

    }

);

export default api;