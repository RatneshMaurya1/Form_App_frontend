import React from "react";
import styles from "./createform.module.css";

const CreateForm = () => {
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
            <select className={styles.select}>
                <option value="">Select an option</option>
                <option value="email">Email</option>
                <option value="text">Text</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
            </select>
            <button className={styles.addInputsBtn}>Add Inputs</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateForm;
