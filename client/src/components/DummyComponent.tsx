import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DummyComponent = () => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/`);
        setData(response.data);
        toast('Data fetched successfully!');
      } catch (err) {
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container p-6">
      <h1>Dummy Component</h1>
      {error && <p>{error}</p>}
      {data && <p>{data}</p>}
    </div>
  );
};

export default DummyComponent;
