// src/Components/Home.js
import React from 'react';
import Header from './Components/Header';
import Main from './Components/Main';
import Footer from './Components/Footer';
import './index.css';


function Home() {
    return (
        <div className="container">
          <Header />
          <main className="main-content">
            <Main />
          </main>
          <footer className="footer">
            <Footer />
          </footer>
        </div>
      );
}

export default Home;
