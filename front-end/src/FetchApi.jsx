import { useState, useEffect } from 'react'

const FetchApi = () => {
    const [test, setTest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const apiFetch = async () => {
        try {
        const response = await fetch('http://127.0.0.1:8000/api/test');
            const data = await response.json();
            setTest(data);
        } catch (error) {
            setError(error);
        };
        setLoading(false);
    }

    useEffect(() => {
        apiFetch();
    }, []);

    if (loading) return 'Loading list...';
    if (error) return 'Error list!';

    return (
        <div>
            <h1>{test.name}</h1>
        </div>
    );

}

export default FetchApi