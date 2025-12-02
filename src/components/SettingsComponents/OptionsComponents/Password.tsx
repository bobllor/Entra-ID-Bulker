import { JSX } from "react";
import OptionBase from "./OptionBase";
import { OptionProps } from "../types";
import { useSettingsContext } from "../../../context/SettingsContext";
import SliderButton from "../../ui/SliderButton";
import { setSetting } from "../functions";
import SliderRange from "../../ui/SliderRange";

const toolTipText: string = "Password settings";
const PARENT_KEY: string = "password";

export default function Password(): JSX.Element{
    const { apiSettings, setApiSettings } = useSettingsContext();

    const options: Array<OptionProps> = [
        {label: "Generate password", element: <></>},
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