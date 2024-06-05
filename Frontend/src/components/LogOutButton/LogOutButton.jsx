import React from "react";
import styles from './LogOutButton.module.css';
import { useAuthenticator } from '@aws-amplify/ui-react';

export const LogOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <button className={styles.addbutton} onClick={signOut}>
      LogOut
    </button>
  );
};
