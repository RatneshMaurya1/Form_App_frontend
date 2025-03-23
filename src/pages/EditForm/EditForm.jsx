import React, { useState, useEffect } from "react";
import styles from "./editform.module.css";
import Input from "../../components/InputPopup/Input";
import toast from "react-hot-toast";
import deleteBtn from "../../assets/Icons.png";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "react-router-dom";
import { createForm, getForms, getFormsById, updateForm } from "../../services";

const EditForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputVaue] = useState("");
  const [sections, setSections] = useState([
    { id: Date.now(), sectionName: "", inputs: [] },
  ]);
  const [selectedSection, setSelectedSection] = useState(sections[0].id);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [loading,setLoading] = useState(false)
  const {id} = useParams();
  const navigate = useNavigate();

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      return toast.error("Section name cannot be empty.");
    }
    if (sections.length >= 5) {
      return toast.error("You can only create up to 5 sections.");
    }
    const newSection = {
      id: String(Date.now()),
      sectionName: newSectionTitle,
      inputs: [],
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
    setNewSectionTitle("");
  };

  const handleAddInput = () => {
    if (inputValue === "") {
      return toast.error("Please select an option.");
    }
    if (!selectedSection) {
      return toast.error("Please select a section first.");
    }
    setIsOpen(true);
  };

  const handleAddInputData = (
    inputTitle,
    inputPlaceholder,
    setInputTitle,
    setInputPlaceholder
  ) => {
    if (!inputTitle.trim() || !inputPlaceholder.trim()) {
      return toast.error("Title and placeholder cannot be empty.");
    }
    const targetSection = sections.find((s) => s.id === selectedSection);
    if (!targetSection) {
      toast.error("Invalid section selected");
      return;
    }
    const newInput = {
      id: String(Date.now()),
      title: inputTitle,
      placeholder: inputPlaceholder,
      type: inputValue,
    };

    setSections(
      sections.map((section) =>
        section.id === selectedSection
          ? { ...section, inputs: [...section.inputs, newInput] }
          : section
      )
    );

    setInputTitle("");
    setInputPlaceholder("");
    setIsOpen(false);
  };

  const handleDeleteInput = (sectionId, inputId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              inputs: section.inputs.filter((i) => i.id !== inputId),
            }
          : section
      )
    );
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const sourceSectionId = result.source.droppableId;
    const destinationSectionId = result.destination.droppableId;

    if (sourceSectionId === destinationSectionId) {
    } else {
      let movedInput;
      const updatedSections = sections.map((section) => {
        if (section.id === sourceSectionId) {
          const newInputs = [...section.inputs];
          [movedInput] = newInputs.splice(result.source.index, 1);
          return { ...section, inputs: newInputs };
        }
        return section;
      });

      setSections(
        updatedSections.map((section) => {
          if (section.id === destinationSectionId && movedInput) {
            const newInputs = [...section.inputs];
            newInputs.splice(result.destination.index, 0, movedInput);
            return { ...section, inputs: newInputs };
          }
          return section;
        })
      );
    }
  };

  useEffect(() => {
    const getFormsData = async () => {
      try {
        const response = await getFormsById(id);
        const fetchedForms = response.forms;

        const fetchedSections = fetchedForms.flatMap((form) =>
          form.sections.map((section) => ({
            ...section,
            id: String(section.id),
            inputs: section.inputs.map((input) => ({
              ...input,
              id: String(input.id),
            })),
          }))
        );

        if (fetchedSections.length === 0) {
          const defaultSection = {
            id: String(Date.now()),
            sectionName: "Default Section",
            inputs: [],
          };
          setSections([defaultSection]);
          setSelectedSection(defaultSection.id);
        } else {
          setSections(fetchedSections);
          setSelectedSection(fetchedSections[0].id);
        }

        setFormTitle(fetchedForms[0]?.title || "");
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    getFormsData();
  }, []);

  const handleSaveForm = async () => {
    if (!formTitle.trim()) {
      return toast.error("form title cannot be empty.");
    }
    if (sections.length === 0) {
      return toast.error("Plase add at least one field.");
    }
    setLoading(true)
    try {
      const response = await updateForm(formTitle, sections,id);
      if (response) {
        toast.success(response.message);
        navigate("/")
      }
    } catch (error) {
      toast.error(error.message || "Failed to save form.");
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className={styles.createformContainer}>
      <div className={styles.createForm}>
        <div className={styles.headingWrapper}>
          <p className={styles.heading}>Edit Form</p>
        </div>
        <div className={styles.title}>
          <p>Title</p>
          <input
            type="text"
            placeholder="Enter form title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionCreator}>
            <input
              type="text"
              placeholder="Enter section name"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
            <button onClick={handleAddSection} className={styles.addSectionBtn}>
              Add Section
            </button>
          </div>

          <div className={styles.sectionSelector}>
            <p>Select Section:</p>
            <select onChange={(e) => setSelectedSection(e.target.value)}>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.sectionName
                    ? section.sectionName
                    : "Default Section"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.addInputs}>
          <select
            className={styles.select}
            onChange={(e) => setInputVaue(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="email">Email</option>
            <option value="text">Text</option>
            <option value="password">Password</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
          <button onClick={handleAddInput} className={styles.addInputsBtn}>
            Add Inputs
          </button>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          {sections.map((section) => (
            <div key={section.id} className={styles.section}>
              <h3>{section.sectionName}</h3>
              <Droppable droppableId={section.id.toString()}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={styles.inputData}
                  >
                    {section.inputs.map((data, i) => (
                      <Draggable
                        key={data.id}
                        draggableId={data.id.toString()}
                        index={i}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.inputDataItem}
                          >
                            <p>{data.title}</p>
                            <input
                              type="text"
                              placeholder={data.placeholder}
                              readOnly
                            />
                            <img
                              onClick={() =>
                                handleDeleteInput(section.id, data.id)
                              }
                              className={styles.deleteButton}
                              src={deleteBtn}
                              alt="delete-btn"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>

        <div className={styles.createButton}>
          <button disabled={loading} onClick={handleSaveForm}>{loading ? "Loading" : "Save Form"}</button>
        </div>

        <Input
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          inputValue={inputValue}
          onSave={handleAddInputData}
        />
      </div>
      <p onClick={() => navigate(-1)} className={styles.backBtn}>
        ◀Back
      </p>
    </div>
  );
};

export default EditForm;
