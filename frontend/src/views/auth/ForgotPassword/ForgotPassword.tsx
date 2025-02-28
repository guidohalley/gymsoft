import ForgotPasswordForm from './ForgotPasswordForm'

const ForgotPassword = () => {
    return <>
        <div className="container mx-auto flex flex-col flex-auto items-center justify-center min-w-0 h-full">
            <div className="card min-w-[320px] md:min-w-[450px] card-shadow">
                <div className="card-body md:p-10">
                    <ForgotPasswordForm disableSubmit={false} />
                </div>
            </div>
        </div>
    </>

}

export default ForgotPassword
