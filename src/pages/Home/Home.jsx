import React, { useEffect, useState } from "react";
import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";
import { deleteForm, getForms } from "../../services";
import toast from "react-hot-toast";

const Home = () => {
  const [allForms,setAllForms] = useState([])
  const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", Date.now().toString());
    }

    useEffect(() => {
      const getFormsData = async () => {
        setLoading(true)
        try {
          const response = await getForms();
          setAllForms(response.forms)
        } catch (error) {
          return console.log(error.message)
        }finally{
          setLoading(false)
        }
      }
      getFormsData()
    },[])

    const handleDeleteForm = async (formId) => {
      try {
        const response = await deleteForm(formId);
        if(response){
          setAllForms(allForms.filter(form => form._id !== formId))
          return toast.success("Form deleted successfully.")
        }
      } catch (error) {
        
      }
    }
  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.header}>
          <h1 className={styles.welcomeText}>Welcome to Form Builder App</h1>
          <button onClick={() =>navigate("/create") } className={styles.createBtn}>create form</button>
        </div>
        <div className={styles.formsContainer}>
        <div className={styles.forms}>
          <p>Your Forms</p>
          <div className={styles.formsList}>
            {allForms.length > 0 ? allForms.map((form) => (
              <div className={styles.form} key={form._id}>
                <p>Form Name: {form.title}</p>
                <div className={styles.btnContainer}>
                <button onClick={() => navigate(`/view/${form._id}`)}  className={styles.view}>View</button>
                <button onClick={() => navigate(`/edit/${form._id}`)} className={styles.edit}>Edit</button>
                <button disabled={loading} onClick={() => handleDeleteForm(form._id)} className={styles.delete}>{loading ? "Loading..." : "Delete"}</button>
                </div>
              </div>
            )): <p>No forms available</p>} 
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Home;
