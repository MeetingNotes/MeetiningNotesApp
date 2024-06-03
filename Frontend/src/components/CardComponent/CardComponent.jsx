import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './CardComponent.module.css';

Modal.setAppElement('#root'); // Set the app root element for accessibility

export const Card = ({ title, description, tasks }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            <article className={styles.card}>
                <header>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </header>
                <ul className={styles.tasks}>
                    {tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                    ))}
                </ul>
                <button onClick={openModal} className={styles.expandButton}>
                    Expand
                </button>
            </article>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Card Details"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <h2>{title}</h2>
                <p>{description}</p>
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                    ))}
                </ul>
                <button onClick={closeModal} className={styles.closeButton}>Close</button>
            </Modal>
        </>
    );
};
