import React from 'react';
import './ListCard.css';

const ListCard = () => {
    return (
        <div className="card-list">
            {(Array.isArray([1, 2, 3]) ? [1, 2, 3] : []).map((card, idx) => (
                <div className="card-container" key={idx}>
                    <div className="card-left">
                        <img
                            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D"
                            alt="listing-image"
                            className="listing-image"
                        />
                        <button className="update">Update</button>
                        <button className="delete">Delete</button>
                    </div>
                    <div className="card-right">
                        <p className="listing-info">3 room bedroom</p>
                        <h3 className="listing-location">Sandton City Hotel</h3>
                        <div className="listing-Amenities">
                            <ul>
                                <li>Wi-Fi</li>
                                <li>Air Conditioning</li>
                                <li>Swimming Pool</li>
                            </ul>
                        </div>
                        <div className="right-footer">
                            <div className="rating rating-inline">
                                <span>5.0⭐</span>
                                <span className="review">(167 reviews)</span>
                                <h4 className="price">R120/night</h4>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListCard;
