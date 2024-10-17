import React from 'react';
import ReactDom from 'react-dom/client';
import { HeijunkaApp } from './HeijunkaApp';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';



ReactDom.createRoot(document.getElementById('root') ).render(
    <React.StrictMode>
        <BrowserRouter>
            <HeijunkaApp />
        </BrowserRouter>
    </React.StrictMode>
)