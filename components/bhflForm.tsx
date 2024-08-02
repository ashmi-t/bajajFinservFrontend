import React, { useState } from 'react';
import { ApiService } from '../services/apiServices';

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

            if (typeof parsedInput !== 'object' || !Array.isArray(parsedInput.data)) {
                setError('Invalid format. JSON must be an object with a "data" array.');
                return;
            }

            if (!parsedInput.data.every(item => typeof item === 'string')) {
                setError('Invalid format. "data" must be an array of strings.');
                return;
            }

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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='Enter JSON (e.g., {"data": ["A", "C", "z"]})'
                />
                <button type="submit">Submit</button>
            </form>
            {error && <p>{error}</p>}
            {response && (
                <div>
                    <h2>Response</h2>
                    <select multiple onChange={handleFilterChange}>
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
