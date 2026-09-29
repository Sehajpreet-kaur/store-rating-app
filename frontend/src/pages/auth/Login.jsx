import CommonForm from "../../common/form.jsx"
import {loginFormControls } from "../../config/index.js"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {Link} from "react-router-dom"
import { loginUser } from "../../store/auth/index.js"
import { toast } from "sonner"
import { rules, validate } from "../../lib/validation.js"

const initialState={
    email:'',
    password:''
}

function AuthLogin(){
    const [formData ,setFormData]=useState(initialState)
    const [errors, setErrors] = useState({})
    const dispatch=useDispatch()
    const { isLoading } = useSelector((state)=> state.auth)

    function onSubmit(event){
        event.preventDefault();

        const found = validate(formData, { email: rules.email, password: rules.required("Password") })
        setErrors(found)
        if (Object.keys(found).length) return

        dispatch(loginUser(formData)).then((data)=>{
            if(data?.payload?.success){
                toast.success(data.payload.message)
            }
            else{
                toast.error(data?.payload?.message || "Login failed")
            }
        })
    }

    return (<div className="mx-auto max-w-md space-y-6">
            <div className="text-center w-full">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
                <p className="mt-2">Don't have an account 
                <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/register'>Register</Link>
                </p>
            </div>
            <CommonForm 
            formControls={loginFormControls}
            buttonText={'Sign In'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isBtnDisabled={isLoading}
            errors={errors}/>
    </div>)
}

export default AuthLogin