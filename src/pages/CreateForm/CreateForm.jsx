import React, { useState } from "react";
import styles from "./createform.module.css";
import Input from "../../components/InputPopup/Input";
import toast from "react-hot-toast";
import deleteBtn from "../../assets/Icons.png";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputVaue] = useState("");
  const [sections, setSections] = useState([{ id: Date.now(), title: "", inputs: [] }]);
  const [selectedSection, setSelectedSection] = useState(sections[0].id);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const navigate = useNavigate();

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      return toast.error("Section name cannot be empty.");
    }
    if (sections.length >= 5) {
      return toast.error("You can only create up to 5 sections.");
    }
    const newSection = { id: Date.now(), title: newSectionTitle, inputs: [] };
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

  const handleAddInputData = (inputTitle, inputPlaceholder, setInputTitle, setInputPlaceholder) => {
    const newInput = {
      id: Date.now(),
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
          ? { ...section, inputs: section.inputs.filter((i) => i.id !== inputId) }
          : section
      )
    );
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const sourceSectionId = parseInt(result.source.droppableId);
    const destinationSectionId = parseInt(result.destination.droppableId);

    if (sourceSectionId === destinationSectionId) {
      setSections(
        sections.map((section) => {
          if (section.id === sourceSectionId) {
            const newInputs = [...section.inputs];
            const [movedInput] = newInputs.splice(result.source.index, 1);
            newInputs.splice(result.destination.index, 0, movedInput);
            return { ...section, inputs: newInputs };
          }
          return section;
        })
      );
    } else {
      let movedInput;
      const updatedSections = sections.map((section) => {
        if (section.id === sourceSectionId) {
          movedInput = section.inputs[result.source.index];
          return { ...section, inputs: section.inputs.filter((_, i) => i !== result.source.index) };
        }
        return section;
      });

      setSections(
        updatedSections.map((section) => {
          if (section.id === destinationSectionId && movedInput) {
            return { ...section, inputs: [...section.inputs, movedInput] };
          }
          return section;
        })
      );
    }
  };

  console.log(sections)
  return (
    <div className={styles.createformContainer}>
      <div className={styles.createForm}>
        <div className={styles.headingWrapper}>
          <p className={styles.heading}>Create Form</p>
        </div>
        <div className={styles.title}>
          <p>Title</p>
          <input type="text" placeholder="Enter form title" />
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
          <select onChange={(e) => setSelectedSection(parseInt(e.target.value))}>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title ? section.title : "Default Section"}
              </option>
            ))}
          </select>
        </div>
        </div>

        {/* Input Selector */}
        <div className={styles.addInputs}>
          <select className={styles.select} onChange={(e) => setInputVaue(e.target.value)}>
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

        {/* Drag and Drop Context */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {sections.map((section) => (
            <div key={section.id} className={styles.section}>
              <h3>{section.title}</h3>
              <Droppable droppableId={section.id.toString()}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={styles.inputData}>
                    {section.inputs.map((data, i) => (
                      <Draggable key={data.id} draggableId={data.id.toString()} index={i}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.inputDataItem}
                          >
                            <p>{data.title}</p>
                            <input type="text" placeholder={data.placeholder} readOnly />
                            <img
                              onClick={() => handleDeleteInput(section.id, data.id)}
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
          <button>Save Form</button>
        </div>

        {/* Pop-up for adding input fields */}
        <Input isOpen={isOpen} onClose={() => setIsOpen(false)} inputValue={inputValue} onSave={handleAddInputData} />
      </div>
      <p onClick={() => navigate(-1)} className={styles.backBtn}>
        ◀️
      </p>
    </div>
  );
};

export default CreateForm;
