import { useState, useEffect } from 'react';
import './App.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Import Swiper styles
import 'swiper/css';

function App(val) {
    console.log(val.data)
    const cardHeight = '30px';
    const [title, setTitle] = useState('Some Title');
    const [question, setQuestion] = useState('Sample Question');
    const [subtitle, setSubtitle] = useState('Sample Subtitle');
    const [answer, setAnswer] = useState('Sample Answer');
    const [cards, setCards] = useState([
        {
            question: 'Sample Question',
            subtitle: 'Sample Subtitle',
            answer: 'Sample Answer',
        },
    ]);
    const [isEdit, setIsEdit] = useState([]);
    const [isTitle, setIsTitle] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false); // New state variable for view mode
    const [flippedCards, setFlippedCards] = useState([]); // State variable to track flipped cards

    useEffect(() => {
        //setters cannot be used in render function only if hook
        if (val.data && val.data.title && val.data.cards && val.data.cards.length > 0) {
            setTitle(val.data.title)
            setCards(val.data.cards)
            setFlippedCards(new Array(cards.length).fill(false))
            setIsEdit(new Array(cards.length).fill(false))
        }
    }, [])

    function DownloadData() {
        const data = {
            title: title,
            cards: cards,
        };
        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flashcards.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function UpdateCard(index) {
        const tempCards = [...cards];
        tempCards[index] = {
            question: question,
            subtitle: subtitle,
            answer: answer,
        };
        setCards(tempCards);
        setIsEdit((prevIsEdit) => {
            const updatedIsEdit = [...prevIsEdit];
            updatedIsEdit[index] = false;
            return updatedIsEdit;
        });
    }

    function handleEdit(index) {
        const updatedIsEdit = [...isEdit];
        updatedIsEdit[index] = true;
        setIsEdit(updatedIsEdit);
    }

    function handleBack(index) {
        const updatedIsEdit = [...isEdit];
        updatedIsEdit[index] = false;
        setIsEdit(updatedIsEdit);
    }

    function flipCard(index) {
        const flipped = [...flippedCards];
        flipped[index] = !flipped[index];
        setFlippedCards(flipped);
    }

    return (
        <>
            {isTitle ? (
                <>
                    <form
                        className="form"
                        style={{ width: '400px' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            setIsTitle(false);
                        }}>
                        <label style={{ height: '60px', display: 'flex', gap: '240px' }}>
                            Title
                            <button
                                onClick={() => {
                                    setIsTitle(false);
                                }}
                                style={{ background: 'red', color: 'white', width: '100px', height: '40px' }}>
                                Back
                            </button>
                        </label>
                        <input style={{ height: '40px' }} onChange={(e) => setTitle(e.target.value)} defaultValue="sample title"></input>
                        <button type="submit">change</button>
                    </form>
                </>
            ) : isViewMode ? (
                <>
                    <h2>{title}</h2>
                    <button onClick={() => setIsViewMode(false)}>Back</button>
                </>
            ) : (
                <>
                    <h2>{title}</h2>
                    <button onClick={() => setIsTitle(true)}>Edit Title</button>
                </>
            )}
            <Swiper
                style={{ padding: '20px' }}
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={50}
                slidesPerView={cards.length > 3 ? 3 : cards.length}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
            >

                {cards.map((card, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div
                                className={`flashCard ${flippedCards[index] ? 'flipped' : ''}`} // Add 'flipped' class if card is flipped
                                onClick={() => flipCard(index)} // Flip card on click
                            >
                                <div className="contentWrapper">
                                    {!isEdit[index] ?
                                        (
                                            <div>
                                                {
                                                    !flippedCards[index] ? (
                                                    <div className="front">
                                                        <h3
                                                            style={{ display: 'flex' }}
                                                        >
                                                            <div>
                                                                {index + 1}
                                                            </div>
                                                            <div style={{ textAlign: 'end', width: '100%' }}>
                                                                {card.subtitle}
                                                            </div>
                                                        </h3>
                                                        <h2 style={{ lineHeight: '40px' }}>{card.question}</h2>
                                                        {!isViewMode && <button onClick={() => handleEdit(index)}>edit</button>}
                                                    </div>
                                                    ) : (
                                                        <div className='back' style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                                            <p style={{ lineHeight: '40px', textAlign: 'center' }}>{card.answer}</p>
                                                        </div>

                                                    )
                                                }
                                            </div>
                                        ) :
                                        (
                                            <div>
                                                <form className="form" onSubmit={(e) => { e.preventDefault(); UpdateCard(index); }}>
                                                    <label style={{ height: cardHeight }}>Question</label>
                                                    <input
                                                        style={{ height: cardHeight }}
                                                        onChange={(e) => setQuestion(e.target.value)}
                                                        defaultValue={card.question}></input>
                                                    <label style={{ height: cardHeight }}>Subtitle</label>
                                                    <input
                                                        style={{ height: cardHeight }}
                                                        onChange={(e) => setSubtitle(e.target.value)}
                                                        defaultValue={card.subtitle}></input>
                                                    <label style={{ height: cardHeight }}>Answer</label>
                                                    <input
                                                        style={{ height: cardHeight }}
                                                        onChange={(e) => setAnswer(e.target.value)}
                                                        defaultValue={card.answer}></input>
                                                    <button type="submit" style={{ color: 'white', background: 'red' }}>Submit</button>
                                                </form>
                                                <button onClick={() => handleBack(index)}>Back</button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            {!isViewMode ?
                <div style={{ width: "400px" }}>
                    <button
                        type="submit"
                        onClick={() => setCards([...cards, { question: 'Sample Question', subtitle: 'Sample Subtitle', answer: 'Sample Answer' }])}>
                        Add One More
                    </button>
                    <button
                        type="submit"
                        onClick={() => {
                            const tempCards = [...cards];
                            tempCards.pop();
                            setCards(tempCards);
                        }}>
                        Delete Last
                    </button>
                    <button
                        onClick={() => setIsViewMode(true)}>View Mode
                    </button>
                    <button onClick={DownloadData}>Download</button>
                </div> :
                null
            }
        </>
    );
}

export default App;
