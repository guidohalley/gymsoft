import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="container mx-auto flex flex-col flex-auto items-center justify-center min-w-0 h-full">
                <div className="card min-w-[320px] md:min-w-[450px] card-shadow">
                    <div className="card-body md:p-10">
                        <div className="mb-8">
                            <h3 className="mb-1 text-center">Bienvenido a Gymsoft</h3>
                        </div>
                        <SignInForm disableSubmit={false} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn
