import CommonForm from "../../common/form.jsx"
import { registerFormControls } from "../../config/index.js"
import { registerUser } from "../../store/auth/index.js"
import {toast} from "sonner"
import { rules, validate } from "../../lib/validation.js"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {Link, useNavigate} from "react-router-dom"

const initialState={
    name:'',
    email:'',
    password:'',
    address:''
}

function AuthRegister(){
    const [formData ,setFormData]=useState(initialState)

    const [errors, setErrors] = useState({})
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const { isLoading } = useSelector((state)=> state.auth)


    function onSubmit(event){
        event.preventDefault(); // stop the browser's default page reload

        const found = validate(formData, {
            name: rules.name,
            email: rules.email,
            address: rules.address,
            password: rules.password,
        })
        setErrors(found)
        if (Object.keys(found).length) return

        dispatch(registerUser(formData)).unwrap()
        .then((data)=>{
            toast.success(data.message)
            navigate('/auth/login')
        })
        .catch((err)=> toast.error(err?.message || "Registration failed"))
    }

    return (<div className="mx-auto  max-w-md space-y-6">
            <div className="text-center w-full">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
                <p className="mt-2">Already have an account 
                 <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/login'>Login</Link>
                </p>
            </div>
            <CommonForm 
            formControls={registerFormControls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isBtnDisabled={isLoading}
            errors={errors}/>

            
    </div>)
}

export default AuthRegister