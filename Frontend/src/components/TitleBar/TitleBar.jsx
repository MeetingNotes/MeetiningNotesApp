import React, { useState } from 'react';
import styles from './TitleBar.module.css';
import { BurgerMenu } from '../../assets'; 
import { useIsMobile } from '../../recoil';
import { useRecoilValue } from 'recoil';
import { UploadButton } from '../UploadButton/UploadButton';
import { LogOutButton } from '../LogOutButton/LogOutButton';

export const TitleBar = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const isMobile = useRecoilValue(useIsMobile);

    const openNav = () => {
        setIsSideNavOpen(true);
        console.log("Open");
    };

    const closeNav = () => {
        setIsSideNavOpen(false);
    };

    return (
        <nav>
            <header className={styles.main}>
                <h1 className={styles.title}>
                    <span className={styles.text_pink}>M</span>
                    <span className={styles.text_white}>eeting</span>
                    <span className={styles.text_pink}>T</span>
                    <span className={styles.text_white}>asks</span>
                </h1>
                { isMobile &&
                    <button className={styles.burgermenu} onClick={openNav} aria-label="Open Side Navigation">
                        <img src={BurgerMenu} alt="Burger Menu" />
                    </button>
                }
            </header>
            {isSideNavOpen && (
                <aside className={styles.sidenav}>
                    <button className={styles.closeBtn} onClick={closeNav} aria-label="Close Side Navigation">×</button>
                    <div className={styles.buttons}>
                        <UploadButton />
                        <LogOutButton />
                    </div>
                </aside>
            )}
        </nav>
    );
};
