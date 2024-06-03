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
        <>
            <nav>
                <div className={styles.main}>
                    <div className={styles.title}>
                        <div className={styles.text_pink}>M</div>
                        <div className={styles.text_white}>eeting</div>
                        <div className={styles.text_pink}>T</div>
                        <div className={styles.text_white}>asks</div>
                    </div>
                    { isMobile &&
                        <img src={BurgerMenu} className="burgermenu" onClick={openNav} alt="Burger Menu" /> 
                    }
                </div>
                {isSideNavOpen && (
                    <div className={styles.sidenav}>
                        <button className={styles.closeBtn} onClick={closeNav}>×</button>
                        <div className={styles.buttons}>
                        <UploadButton />
                        <LogOutButton />
                        </div>
                    </div>
                )}
                
            </nav>   
        </>
    );
};
