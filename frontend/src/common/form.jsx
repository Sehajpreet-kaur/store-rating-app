import { Input} from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {Select,SelectTrigger, SelectValue, SelectItem, SelectContent} from "../components/ui/select";
import { Label } from "../components/ui/label";


function CommonForm({formControls,formData,setFormData,onSubmit,buttonText,isBtnDisabled,errors={}}){

    function renderInputsByComponentType(getControlItem){
        let element=null;
        const value= formData[getControlItem.name] || "";

        switch (getControlItem.componentType){
            case 'input':
                element=(<Input
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={getControlItem.type}
                value={value}
                onChange={event => setFormData({
                    ...formData, //destructure form data
                    [getControlItem.name]:event.target.value
                })}
                />
                )
                break;
            case "select":
                element=(
                    <Select onValueChange={(value)=> setFormData({
                        ...formData,
                        [getControlItem.name]:value
                    })} value={value}>
                        <SelectTrigger className="w-full ">
                            <SelectValue placeholder={getControlItem.label}/>
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-[9999] bg-white">
                            {
                                getControlItem.options && getControlItem.options.length >0 ?
                                getControlItem.options.map((optionItem) =>( <SelectItem key={optionItem.id} value={optionItem.id} 
                                    className="transition-all duration-150  data-[highlighted]:bg-gray-200  data-[highlighted]:text-base data-[highlighted]:font-medium  data-[highlighted]:scale-[1.02]">{optionItem.label || optionItem.name}</SelectItem>)) :null
                            }
                        </SelectContent>
                    </Select>
                )
                break;
            
            case 'textarea':
                element=(<Textarea
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                value={value}
                onChange={event => setFormData({
                    ...formData, //destructure form data
                    [getControlItem.name]:event.target.value
                })}
                />
                )
                break;
            
            default:
                element=(<Input
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={getControlItem.type}
                value={value}
                onChange={event => setFormData({
                    ...formData, //destructure form data
                    [getControlItem.name]:event.target.value
                })}
                />
                )
                break;

        }
        return element;
    }
    return(
        <form onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-3">
                {
                    formControls.map(controlItem => <div className="grid w-full gap-1.5" key={controlItem.name}>
                        <Label htmlFor={controlItem.name} className="mb-1">{controlItem.label}</Label>
                        {
                            renderInputsByComponentType(controlItem)
                        }
                        {errors[controlItem.name] && (
                            <p className="text-xs text-destructive" role="alert">{errors[controlItem.name]}</p>
                        )}
                    </div>)
                }
            </div>
            <Button disabled={isBtnDisabled} type='submit' className="mt-2 w-full">{buttonText || 'Submit'}</Button>
        </form>
    )
}

export default CommonForm;