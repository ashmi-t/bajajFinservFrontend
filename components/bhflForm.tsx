import { useState } from 'react';
import { ApiService } from '../services/apiServices';
import React from 'react';

// Define types for the response and state
interface ApiResponse {
    is_success: boolean;
    user_id: string;
    email: string;
    roll_number: string;
    numbers: string[];
    alphabets: string[];
    highest_alphabet: string[];
}

export default function BfhlForm() {
    const [jsonInput, setJsonInput] = useState<string>('');
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string>('');
    const [filter, setFilter] = useState<string[]>([]);
    const apiService = new ApiService();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsedInput = JSON.parse(jsonInput);
            console.log("parsedInput") 
            console.log(parsedInput)
    
            if (typeof parsedInput !== 'object' || !Array.isArray(parsedInput.data)) {
                setError('Invalid format. JSON must be an object with a "data" array.');
                return;
            }
    
            if (!parsedInput.data.every((item: any) => typeof item === 'string')) {
                setError('Invalid format. "data" must be an array of strings.');
                return;
            }
    
            // Send data to the API
            const data = await apiService.sendData(parsedInput);
            setResponse(data);
            setError('');
        } catch (err) {
            if (err instanceof SyntaxError) {
                setError('Invalid JSON');
            } else {
                setError('An error occurred while fetching data');
            }
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setFilter(value);
    };

    // Define inline styles
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7f7f7',
        padding: '20px'
    };

    const formStyle = {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        width: '100%',
        maxWidth: '500px'
    };

    const inputFieldStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '10px',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    };

    const buttonHoverStyle = {
        backgroundColor: '#005bb5'
    };

    const errorStyle = {
        color: 'red',
        marginTop: '10px'
    };

    const responseStyle = {
        marginTop: '20px'
    };

    const selectStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box'
    };

    return (
        <div style={containerStyle}>
            <form style={formStyle} onSubmit={handleSubmit}>
                <input
                    type="text"
                    style={inputFieldStyle}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='Enter JSON (e.g., {"data": ["A", "C", "z"]})'
                />
                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
                >
                    Submit
                </button>
            </form>
            {error && <p style={errorStyle}>{error}</p>}
            {response && (
                <div style={responseStyle}>
                    <h2>Response</h2>
                    <select multiple style={selectStyle} onChange={handleFilterChange}>
                        <option value="numbers">Numbers</option>
                        <option value="alphabets">Alphabets</option>
                        <option value="highest_alphabet">Highest Alphabet</option>
                    </select>
                    <div>
                        {filter.includes("numbers") && (
                            <p>Numbers: {response.numbers.join(', ')}</p>
                        )}
                        {filter.includes("alphabets") && (
                            <p>Alphabets: {response.alphabets.join(', ')}</p>
                        )}
                        {filter.includes("highest_alphabet") && (
                            <p>Highest Alphabet: {response.highest_alphabet.join(', ')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}