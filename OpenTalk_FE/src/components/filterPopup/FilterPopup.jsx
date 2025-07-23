import React, { useState } from "react";
import "./FilterPopup.css";

const departments = [
    "Design", "HR", "Sales", "Business Analyst",
    "Project Manager", "Java", "Python", "React JS", "Account", "Nods JS"
];

const FilterPopup = ({ isOpen, onClose, onApply }) => {
    const [selectedDepts, setSelectedDepts] = useState(["Design", "Java", "Python", "Project Manager"]);
    const [selectedType, setSelectedType] = useState("Office");

    const toggleDept = (dept) => {
        setSelectedDepts((prev) =>
            prev.includes(dept)
                ? prev.filter((d) => d !== dept)
                : [...prev, dept]
        );
    };

    const handleApply = () => {
        onApply({ departments: selectedDepts, type: selectedType });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="filter-popup-overlay">
            <div className="filter-popup">
                <h5 className="filter-title">Filter</h5>
                <input type="text" className="search-input" placeholder="🔍 Search Employee" />

                <div className="filter-section">
                    <strong>Department</strong>
                    <div className="department-list">
                        {departments.map((dept) => (
                            <label key={dept} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedDepts.includes(dept)}
                                    onChange={() => toggleDept(dept)}
                                />
                                {dept}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <strong>Select Type</strong>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="type"
                            value="Office"
                            checked={selectedType === "Office"}
                            onChange={() => setSelectedType("Office")}
                        />
                        Office
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="type"
                            value="Work from Home"
                            checked={selectedType === "Work from Home"}
                            onChange={() => setSelectedType("Work from Home")}
                        />
                        Work from Home
                    </label>
                </div>

                <div className="filter-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-apply" onClick={handleApply}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;
