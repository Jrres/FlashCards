import { useState, useEffect } from 'react';
import FlashCard from "./FlashCard.jsx";
import './App.css';
import Files from './Files.jsx';

function App() {
  const [create, setCreate] = useState(false);
  const [view,setView] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const handleDataLoaded = (event) => {
      setData(event.detail);
      setView(true)
      setCreate(false)
      console.log(event.detail)

    };

    window.addEventListener('dataLoaded', handleDataLoaded);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('dataLoaded', handleDataLoaded);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  function handleCreate() {
    setCreate(true);
  }

  function handleBack() {
    setCreate(false);
    setView(false)
  }

  return (
    <>
   {!create && !view  ? <aside 
   style={{ position: 'absolute', width: '200px', right: '0', padding: '80px', background: 'url(./public/cloud.png) center center / contain no-repeat' }}>
  <h3 style={{display:'flex',textAlign:'center',color:'black',fontSize:'10px'}}>
    Flashy is a simple tool to make flash cards. All you have to do is create a set of flash cards that you can edit to your liking. When you're done, download the file and reuse the cards to study with. Enjoy!!! -Jack
  </h3>
</aside>:null}

    <h1>
      Flashy
      <a href="https://www.flaticon.com/free-icons/sharpie" title="sharpie icons">
        <img src='./public/art.png' style={{width:'30px',height:'30px'}}></img>
      </a>
    </h1>
      {view && data !==null ? (
        
        <div>
          <button 
            onClick={handleBack}
            style={{ background: 'blue', color: 'white', position: 'absolute', top: 0, left: 0 }}>Back</button>
        <FlashCard data={data} />
        </div>
      ):null}
      {create ? (
        <div>
          <button 
            onClick={handleBack}
            style={{ background: 'blue', color: 'white', position: 'absolute', top: 0, left: 0 }}>Back</button>
          <FlashCard  />
        </div>
      ) : !view ? (
        <div>
          <section style={{ height: '300px' }}>
            <h2>Already have a flashcard set?</h2>
            <Files />
            <h3>File extension is Json</h3>
          </section>
          <section>
            <div 
              style={{ backgroundImage: 'url(./public/flashcard.jpg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
              className="flashCard">
              <button 
                onClick={handleCreate}
                type="submit"
                className="CreateButton"
                style={{ background: 'transparent',border:'solid 2px rgb(200,1,200)',color:'blue' }}>Create</button>
            </div>
          </section>
        </div>
      ):null}
    </>
  );
}

export default App;
