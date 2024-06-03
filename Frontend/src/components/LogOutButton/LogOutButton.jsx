import React from "react";
import styles from './LogOutButton.module.css';
import { LogOut } from "../../assets";

export const LogOutButton = () => {

    const deletetoken = () => {
        
      };

    return(
        <button className={styles.addbutton} onClick={deletetoken}>
        LogOut 
        </button>
    );
};