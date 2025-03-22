import React, { useState } from 'react'
import styles from "./input.module.css";

const Input = ({isOpen,onClose,inputValue,onSave}) => {
    const [inputTitle,setInputTitle] = useState("")
    const [inputPlaceholder,setInputPlaceholder] = useState("")

    if(!isOpen) return null;
  return (
    <>
    <div className={styles.popup} onClick={onClose}>
        <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
            <p className={styles.inputVal}>{inputValue}</p>
            <div className={styles.inputItems}> 
                <input type="text" placeholder='Title' value={inputTitle} onChange={(e) => setInputTitle(e.target.value)}/>
                <input type="text" placeholder='Placeholder' value={inputPlaceholder} onChange={(e) => setInputPlaceholder(e.target.value)}/>
            </div>
            <div className={styles.addBtn}>
            <button onClick={() => {onSave(inputTitle,inputPlaceholder,setInputTitle,setInputPlaceholder)}} >Add</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Input
