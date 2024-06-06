import styles from './DashBoard.module.css';
import { UploadButton } from '../components/UploadButton/UploadButton';
import { LogOutButton } from '../components/LogOutButton/LogOutButton';
import { Card } from '../components/CardComponent/CardComponent';
import { useEffect, useState } from 'react';
import React from 'react';
import { fetchTranscriptions } from '../services/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';


export const DashBoard = ({ user }) => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(6);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchTranscriptionsData = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        console.log(token);
        const response = await fetchTranscriptions(token, currentPage + 1, cardsPerPage);
        setTranscriptions(response.data);
      } catch (error) {
        console.error('Error fetching transcriptions:', error);
      }
    };

    fetchTranscriptionsData();
  }, [user, currentPage, cardsPerPage]);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 768) {
        setCardsPerPage(2);
        setIsMobile(true);
      } else if (windowWidth <= 1200) {
        setCardsPerPage(6);
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main className={styles.main}>
      {!user ? (
        <div className={styles.authContainer}>
          <Authenticator/>
        </div>
      ) : (
        <>
          {!isMobile && (
            <section className={styles.left}>
              <UploadButton />
              <LogOutButton />
            </section>
          )}
          <section className={styles.right}>
            <div className={styles.cardsContainer}>
              {transcriptions.map((transcription, index) => (
                <Card
                  key={index}
                  id={transcription.id}
                  title={transcription.title}
                  timestamp={transcription.timestamp}
                  description={transcription.description}
                />
              ))}
            </div>
            <nav className={styles.pagination}>
              <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                Previous
              </button>
              <button onClick={handleNextPage}>
                Next
              </button>
            </nav>
          </section>
        </>
      )}
    </main>
  );
};
