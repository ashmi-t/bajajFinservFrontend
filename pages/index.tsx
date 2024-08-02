// pages/index.tsx
import { useEffect } from 'react';
import React from 'react';
import BfhlForm from '../components/bhflForm';

export default function Home() {
    useEffect(() => {
        document.title = "Your Roll Number";
    }, []);

    return (
        <div>
            <h1>Your Roll Number</h1>
            <BfhlForm />
        </div>
    );
}