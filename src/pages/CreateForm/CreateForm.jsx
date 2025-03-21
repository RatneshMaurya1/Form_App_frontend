import React, { useState } from "react";
import styles from "./createform.module.css";
import Input from "../../components/InputPopup/Input";
import toast from "react-hot-toast";

const CreateForm = () => {
    const [isOpen,setIsOpen] = useState(false)
    const [inputValue,setInputVaue] = useState("")

    const handleAddInput = () => {
        if(inputValue === ""){
            return toast.error("Please select an option")
        }
        setIsOpen(true)
    }
    const handleAddInputData = (inputTitle,inputPlaceholder) => {
        console.log(inputTitle)
        console.log(inputPlaceholder)
    }
  return (
    <>
      <div className={styles.createformContainer}>
        <div className={styles.createForm}>
          <div className={styles.headingWrapper}>
            <p className={styles.heading}>Create Form</p>
          </div>
          <div className={styles.title}>
            <p>Title</p>
            <input type="text" placeholder="Enter form title" />
          </div>
          <div className={styles.addInputs}>
            <select className={styles.select} onChange={(e) =>setInputVaue(e.target.value)}>
                <option value="">Select an option</option>
                <option value="email">Email</option>
                <option value="text">Text</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
            </select>
            <button onClick={handleAddInput} className={styles.addInputsBtn}>Add Inputs</button>
          </div>
        </div>
        <Input
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        inputValue={inputValue}
        onSave={handleAddInputData}
        />
      </div>
    </>
  );
};

export default CreateForm;
