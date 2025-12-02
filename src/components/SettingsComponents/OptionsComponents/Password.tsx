import { JSX, useState } from "react";
import OptionBase from "./OptionBase";
import { OptionProps } from "../types";
import { useSettingsContext } from "../../../context/SettingsContext";
import SliderButton from "../../ui/SliderButton";
import { setSetting } from "../functions";
import SliderRange from "../../ui/SliderRange";
import Button from "../../ui/Button";
import { generatePassword } from "../../../pywebviewFunctions";
import { FaClipboard } from "react-icons/fa";
import { toastSuccess } from "../../../toastUtils";

const toolTipText: string = "Password settings";
const PARENT_KEY: string = "password";

export default function Password(): JSX.Element{
    const { apiSettings, setApiSettings } = useSettingsContext();

    const options: Array<OptionProps> = [
        {
            label: "Generate password", 
            element: <GeneratePassword />, 
            justify: "between"
        },
        {
            label: "Password length", 
            element: <SliderRange targetKey="length" baseValue={apiSettings.password.length} 
                parent="password" 
                updaterFunc={(number: number) => setApiSettings
                    (prev => ({...prev, password: {...prev.password, length: number}}))} />,
        },
        {
            label: "Include uppercase letters", 
            element: <SliderButton func={(status: boolean) => {
                setSetting("use_uppercase", !status, 
                    () => {setApiSettings(prev => ({...prev, password: {...prev.password, use_uppercase: !status}}))},
                    PARENT_KEY
                );
            }} 
            status={apiSettings.password.use_uppercase}/>
        },
        {
            label: "Include punctuations", 
            element: <SliderButton func={(status: boolean) => {
                setSetting("use_punctuations", !status, 
                    () => {setApiSettings(prev => ({...prev, password: {...prev.password, use_punctuations: !status}}))},
                    PARENT_KEY
                );
            }} 
            status={apiSettings.password.use_punctuations}/>
        },
    ];

    return (
        <>
            <OptionBase options={options} title="Password" tooltipText={toolTipText} />
        </>
    )
}

function GeneratePassword(): JSX.Element{
    const [password, setPassword] = useState<string>("");

    return (
        <div className="flex items-center justify-between w-full">
            <div className={`${password == "" ? "opacity-0" : "opacity-100"} transition-all`}>
                <div className="bg-white p-3 input-style rounded-2xl w-70 flex items-center
                justify-between">
                    <span>
                        {password}
                    </span>
                    <span 
                    className="p-2 rounded-xl hover:bg-gray-400"
                    title="Copy to clipboard"
                    onClick={() => {
                        navigator.clipboard.writeText(password).then(() => {
                            toastSuccess("Copied to clipboard")
                        });
                    }}>
                        <FaClipboard size={18}/>
                    </span>
                </div>
            </div>
            <Button text="Generate" type="button" func={() => {
                generatePassword().then(pw => {
                    setPassword(pw);
                })
            }}/>
        </div>
    )
}