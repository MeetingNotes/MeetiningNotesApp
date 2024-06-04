import styles from './DashBoard.module.css'
import { UploadButton } from "../components/UploadButton/UploadButton";
import { LogOutButton } from "../components/LogOutButton/LogOutButton";
import { Card } from "../components/CardComponent/CardComponent";
import { useEffect, useState } from 'react';
import { useIsMobile, useWindowWidth } from '../recoil';
import { useRecoilValue } from 'recoil';
import React from 'react';

export const DashBoard = () => {
    const isMobile = useRecoilValue(useIsMobile);
    const windowWidth = useRecoilValue(useWindowWidth);


    const cardData = [
        {
            title: 'Daily Standup',
            description: 'Wednesday Stand Up 10 May',
            tasks: ['Discuss progress on current sprint', 'Identify any blockers', 'Plan tasks for the day']
        },
        {
            title: 'Weekly Standup',
            description: 'Monday Stand Up 8 May',
            tasks: ['Review last week\'s progress', 'Set goals for the week', 'Discuss upcoming deadlines']
        },
        {
            title: 'Sprint Planning',
            description: 'Tuesday Sprint Planning 9 May',
            tasks: ['Review sprint backlog', 'Estimate tasks', 'Assign tasks to team members']
        },
        {
            title: 'Sprint Retrospective',
            description: 'Friday Sprint Retrospective 12 May',
            tasks: ['Review sprint outcomes', 'Discuss what went well', 'Identify areas for improvement']
        },
        {
            title: 'Client Meeting',
            description: 'Thursday Client Meeting 11 May',
            tasks: ['Present project updates', 'Gather client feedback', 'Plan next steps']
        },
        {
            title: 'Team Sync',
            description: 'Wednesday Team Sync 17 May',
            tasks: ['Sync on project status', 'Address team concerns', 'Coordinate upcoming tasks']
        },
        {
            title: 'Tech Review',
            description: 'Friday Tech Review 19 May',
            tasks: ['Review technical debt', 'Discuss new technologies', 'Plan tech upgrades']
        },
        {
            title: 'Product Demo',
            description: 'Tuesday Product Demo 16 May',
            tasks: ['Demo new features', 'Gather team feedback', 'Plan next development steps']
        },
        {
            title: 'QA Review',
            description: 'Thursday QA Review 18 May',
            tasks: ['Review QA results', 'Plan bug fixes', 'Discuss testing strategies']
        },
        {
            title: 'Design Meeting',
            description: 'Monday Design Meeting 15 May',
            tasks: ['Review design mockups', 'Discuss user experience', 'Plan design improvements']
        },
        {
            title: 'Marketing Sync',
            description: 'Tuesday Marketing Sync 23 May',
            tasks: ['Sync on marketing strategies', 'Review campaign performance', 'Plan upcoming campaigns']
        },
        {
            title: 'Budget Review',
            description: 'Friday Budget Review 26 May',
            tasks: ['Review budget status', 'Plan next quarter budget', 'Discuss financial strategies']
        },
        {
            title: 'Code Review',
            description: 'Wednesday Code Review 24 May',
            tasks: ['Review code submissions', 'Discuss coding standards', 'Plan code improvements']
        },
        {
            title: 'HR Meeting',
            description: 'Monday HR Meeting 22 May',
            tasks: ['Discuss HR policies', 'Plan employee engagement', 'Review team feedback']
        },
        {
            title: 'Operations Sync',
            description: 'Thursday Operations Sync 25 May',
            tasks: ['Sync on operational tasks', 'Address logistical issues', 'Plan next steps']
        },
        {
            title: 'Strategy Meeting',
            description: 'Friday Strategy Meeting 2 June',
            tasks: ['Discuss company strategy', 'Plan strategic initiatives', 'Review strategic goals']
        },
        {
            title: 'All Hands Meeting',
            description: 'Wednesday All Hands Meeting 31 May',
            tasks: ['Company-wide updates', 'Q&A session', 'Celebrate team achievements']
        },
        {
            title: 'Customer Feedback',
            description: 'Monday Customer Feedback 29 May',
            tasks: ['Review customer feedback', 'Plan product improvements', 'Discuss customer satisfaction']
        },
        {
            title: 'Sales Sync',
            description: 'Thursday Sales Sync 1 June',
            tasks: ['Sync on sales targets', 'Review sales performance', 'Plan sales strategies']
        },
        {
            title: 'Innovation Workshop',
            description: 'Tuesday Innovation Workshop 30 May',
            tasks: ['Brainstorm new ideas', 'Review innovation pipeline', 'Plan innovation initiatives']
        }
    ];
    const [currentPage, setCurrentPage] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(isMobile ? 2 : 6);
    // const cardsPerPage = isMobile ? 2 : 6;


    useEffect(() => {
        if (windowWidth <= 768) {
            setCardsPerPage(2);
        } else if (windowWidth <= 1200) {
            setCardsPerPage(6);
        } else if (windowWidth >= 2000){
            setCardsPerPage(12);
        }
      }, [windowWidth,cardsPerPage])
    ;
    console.log(windowWidth);
    

    const startIndex = currentPage * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = cardData.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (endIndex < cardData.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (startIndex > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <main className={styles.main}>
            {!isMobile &&
                <section className={styles.left}>
                    <UploadButton />
                    <LogOutButton />
                </section>
            }
            <section className={styles.right}>
                <div className={styles.cardsContainer}>
                    {currentCards.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            description={card.description}
                            tasks={card.tasks}
                        />
                    ))}
                </div>
                <nav className={styles.pagination}>
                    <button onClick={handlePreviousPage} disabled={startIndex === 0}>
                        Previous
                    </button>
                    <button onClick={handleNextPage} disabled={endIndex >= cardData.length}>
                        Next
                    </button>
                </nav>
            </section>
        </main>
    );
};