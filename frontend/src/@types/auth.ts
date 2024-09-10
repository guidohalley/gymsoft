export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    data:{
        token: string
    },
    user: {
        userName: string
        authority: string[]
        avatar: string
        email: string
    }
}

export type LoginResponse = {
    ok: boolean;
    status: number;
    message: string;
    data: {
        token: string,
        usuario:{
            nombre:string,
            apellido:string,
            email:string
            rol:string,
            authority:string[]
        }
    };
    timestamp: string;
};

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}
