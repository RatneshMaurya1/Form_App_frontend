import React, { useState, useEffect } from "react";
import styles from "./viewform.module.css";
import { getForms, getFormsById } from "../../services";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ViewForm = () => {
  const [allForms, setAllForms] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const {id} = useParams()

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await getFormsById(id);
        setAllForms(response.forms);
      } catch (error) {
        console.error("Error fetching forms:", error.message);
      }
    };
    fetchForms();
  }, []);

  const handleChange = (formId, sectionId, inputId, value) => {
    setFormData((prev) => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [sectionId]: {
          ...prev[formId]?.[sectionId],
          [inputId]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Form submitted successfully");
    return navigate("/");
  };

  return (
    <div className={styles.createformContainer}>
      {allForms.length === 0 ? (
        <p>No forms available</p>
      ) : (
        allForms.map((form) => (
          <form
            key={form._id}
            className={styles.formCard}
            onSubmit={handleSubmit}
          >
            <h3>{form.title}</h3>
            {form.sections.map((section) => (
              <div key={section._id} className={styles.section}>
                <h4>{section.sectionName || ""}</h4>
                <div className={styles.inputContainerWrapper}>
                  {section.inputs.map((input) => (
                    <div key={input._id} className={styles.inputContainer}>
                      <label>{input.title}</label>
                      <input
                        type={input.type}
                        placeholder={input.placeholder}
                        required
                        onChange={(e) =>
                          handleChange(
                            form._id,
                            section._id,
                            input._id,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.submitBtn}>
              <button type="submit">Submit Form</button>
            </div>
          </form>
        ))
      )}
      <p onClick={() => navigate(-1)} className={styles.backBtn}>
        ◀Back
      </p>
    </div>
  );
};

export default ViewForm;
