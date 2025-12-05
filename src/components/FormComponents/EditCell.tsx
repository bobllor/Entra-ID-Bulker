import React, { JSX, useEffect, useRef } from "react";
import { ManualData } from "./manualUtils/types";
import toast from "react-hot-toast";
import { toaster, toastError } from "../../toastUtils";
import { FaTimes, FaCheck } from "react-icons/fa";

const buttonClass: string = "hover:bg-gray-400 p-2 rounded-xl";

/** Component of ManualTable that reveals an edit box for a selected cell. */
export default function EditCell({id, stringVal, setEditCell, manData, checkEmpty = false}: EditCellProps): JSX.Element{
    const inputRef = useRef<HTMLInputElement|null>(null);
    
    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [])
    
    return (
        <>
            <div
            className="absolute h-12 z-4 bg-white border-1 border-black/40 rounded-2xl p-4 flex justify-center items-center gap-5">
                <input className="py-1 px-2 rounded-xl w-35 input-style"
                spellCheck={false}
                ref={inputRef}
                type="text" defaultValue={stringVal} 
                onKeyDown={(e) => {
                    if(e.key == 'Escape') setEditCell('');

                    if(e.key == 'Enter'){
                        const inputVal: string = e.currentTarget.value;
                        // used only for comparisons
                        const loweredInputVal: string = inputVal.toLowerCase().trim();

                        if(inputVal.trim() == ''){
                            toastError('Cannot have an empty value for the Name field');
                            return;
                        }
                        
                        if(inputVal.trim() == stringVal){
                            setEditCell('');
                        }else{
                            const filteredObj: ManualData = manData.manualData.filter((obj) => id.includes(obj.id!))[0];

                            // the else condition guarantees that the input is different than the original column value. 
                            // yes, it is quite confusing... but i don't want to rewrite my function (hindsight 20/20)
                            const nameVal: string = filteredObj.name!.toLowerCase();
                            const columnVal: string = filteredObj.opco!.toLowerCase();

                            if(nameVal == loweredInputVal || columnVal == loweredInputVal){
                                toaster('Duplicate values in the fields.', "error");
                                return;
                            }   
                            
                            manData.setManualData(prev => {
                                const newData: Array<ManualData> = prev.map((obj) => {
                                    const objID: string = obj.id!;
                                    
                                    // id is unique (even with dupes in names)
                                    // id = obj.id + obj.name, easy way to diff the two columns
                                    if(id.includes(objID)){
                                        const columnVal: string = id.replace(objID, '');
                                        
                                        for(const key of Object.keys(obj)){
                                            if(obj[key as keyof ManualData] == columnVal){
                                                return {
                                                    ...obj,
                                                    [key]: inputVal
                                                }
                                            }
                                        }
                                    }
                                    
                                    // i'm like 95% sure this will not be reached.
                                    return {...obj};
                                })

                                return newData;
                            })

                            setEditCell('');
                        };
                    }
                }}/>
                <div
                className="flex gap-1">
                    <span 
                    onClick={() => addManualEntry(inputRef, checkEmpty).then(
                        (status) => {
                            if(status){
                                setEditCell('');
                            }
                        })
                    }
                    className={buttonClass}>
                        <FaCheck color="green" />
                    </span>
                    <span
                    className={buttonClass}
                    onClick={() => setEditCell('')}>
                        <FaTimes color="red" />
                    </span>
                </div>
            </div>
        </>
    )
}

type EditCellProps = {
    id: string,
    stringVal: string,
    setEditCell: React.Dispatch<React.SetStateAction<string>>,
    manData: ManDataProps,
    checkEmpty?: boolean,
}

type ManDataProps = {
    manualData: Array<ManualData>
    setManualData: React.Dispatch<React.SetStateAction<Array<ManualData>>>
}

async function addManualEntry(inputRef: React.RefObject<HTMLInputElement|null>, checkEmpty: boolean): Promise<boolean>{
    if(inputRef.current == null){
        return false;
    }

    const value: string = inputRef.current.value;
    
    if(value == "" && checkEmpty){
        toastError("Cannot have empty value");
    
        return false;
    }

    console.log(value);

    return true;
}