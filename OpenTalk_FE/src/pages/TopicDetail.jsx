import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the route params
import ProposalDetail from "/src/components/proposalTopic/ProposalDetail.jsx";
import axios from '/src/api/axiosClient.jsx';
import {getAccessToken} from "../helper/auth.jsx";
import "./styles/TopicDetail.css"

const TopicDetail = () => {
    const { id } = useParams(); // Extract 'id' from the URL params
    const [data, setData] = useState(null); // State to hold the data

    // Fetch data when the component mounts or when 'id' changes
    useEffect(() => {
        // Example: Fetch data from an API based on the 'id' parameter
        const fetchData = async () => {
            try {
                // Replace the URL with your actual API endpoint
                const response = await axios.get(`/topic-idea/${id}`,{
                    headers: { Authorization: `Bearer ${getAccessToken()}` }
                });
                setData(response.data); // Set the data received from API
            } catch (error) {
                console.error("Error fetching topic details:", error);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <ProposalDetail {} />
        </div>
    );
};

export default TopicDetail;
