import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './CardComponent.module.css';
import { fetchTranscriptionById } from '../../services/api';
import { fetchAuthSession } from 'aws-amplify/auth';


export const Card = ({ id, title, timestamp, description }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detailedData, setDetailedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = async () => {
    setIsLoading(true);
    setModalIsOpen(true);

    try {
      const session = await fetchAuthSession();
      const authToken = session.tokens?.accessToken?.toString();

      const data = await fetchTranscriptionById(authToken, id);
      console.log(data);
      setDetailedData(data);
    } catch (error) {
      console.error('Error fetching transcription details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDetailedData(null);
  };

  return (
    <>
      <article className={styles.card} id={id}>
        <header>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.timestamp}>{new Date(timestamp).toLocaleString()}</p>
          <p className={styles.description}>{description}</p>
        </header>
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
        {isLoading ? (
          <div className={styles.loader}></div>
        ) : (
          detailedData && (
            <>
              <h2>{detailedData.title}</h2>
              <p>{new Date(detailedData.timestamp).toLocaleString()}</p>
              <p>{detailedData.description}</p>
              <ul>
                {detailedData.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
              <button onClick={closeModal} className={styles.closeButton}>Close</button>
            </>
          )
        )}
      </Modal>
    </>
  );
};
