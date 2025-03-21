import React from "react";
import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate()
  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.header}>
          <h1 className={styles.welcomeText}>Welcome to Form Builder App</h1>
          <button onClick={() =>navigate("/create") } className={styles.createBtn}>create form</button>
        </div>
      </div>
    </>
  );
};

export default Home;
