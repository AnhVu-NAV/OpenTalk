import React, { useEffect, useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaBuilding,
} from 'react-icons/fa';
import BranchFormModal from '../components/companyBranchFormModal/BranchFormModal.jsx';
import DeleteModal from '../components/deleteModal/DeleteModal.jsx';
import {
  getCompanyBranches,
  createCompanyBranch,
  updateCompanyBranch,
  deleteCompanyBranch,
  getCompanyBranch,
} from '../api/companyBranch';
import './styles/OrganizationListPage.css';

const OrganizationListPage = () => {
  const [branches, setBranches] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const data = await getCompanyBranches();
      setBranches(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  function isDuplicateName(name) {
    return branches.some((branch) => branch.name.toLowerCase() === name.toLowerCase() && branch.id !== (selected ? selected.id : null));
  }

  const handleCreate = async (payload) => {
    if (isDuplicateName(payload.name)) {
      setError('Branch name already exists');
    } else {
      setError(null);
      await createCompanyBranch(payload);
      setModalOpen(false);
      loadData();
    }
  };

  const handleUpdate = async (payload) => {
    if (!selected) return;
    if (isDuplicateName(payload.name)) {
      setError('Branch name already exists');
    } else {
      setError(null);
      await updateCompanyBranch(selected.id, payload);
      setModalOpen(false);
      setSelected(null);
      loadData();
    }
  };

  const handleDelete = async () => {
    if (!selectedBranch) return;
    await deleteCompanyBranch(selectedBranch.id);
    setShowDelete(false);
    setSelectedBranch(null);
    loadData();
  };

  const itemsPerPage = 8;
  const filteredBranches = (Array.isArray(branches) ? branches : []).filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="organization-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <FaBuilding />
          </div>
          <div className="header-text">
            <h1 className="page-title">Organization Management</h1>
            <p className="page-subtitle">Manage your company branches and locations</p>
          </div>
        </div>
        <button 
          className="add-branch-btn" 
          onClick={() => { 
            setSelected(null); 
            setError(null); 
            setModalOpen(true); 
          }}
        >
          <FaPlus />
          Add Branch
        </button>
      </div>

      <div className="search-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="branches-container">
        {paginatedBranches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaBuilding />
            </div>
            <h3>No branches found</h3>
            <p>
              {filteredBranches.length === 0 && searchTerm 
                ? `No branches match "${searchTerm}"`
                : "Get started by adding your first branch"
              }
            </p>
            {filteredBranches.length === 0 && !searchTerm && (
              <button 
                className="empty-action-btn" 
                onClick={() => { 
                  setSelected(null); 
                  setError(null); 
                  setModalOpen(true); 
                }}
              >
                <FaPlus />
                Add Your First Branch
              </button>
            )}
          </div>
        ) : (
          <div className="branches-grid">
            {paginatedBranches.map((branch, index) => (
              <div key={branch.id} className="branch-card">
                <div className="branch-card-header">
                  <div className="branch-icon">
                    <FaBuilding />
                  </div>
                  <div className="branch-actions">
                    <button
                      onClick={async () => {
                        try {
                          const data = await getCompanyBranch(branch.id);
                          setSelected(data);
                          setError(null);
                          setModalOpen(true);
                        } catch (error) {
                          console.error('Error fetching branch:', error);
                        }
                      }}
                      className="action-btn edit-btn"
                      title="Edit Branch"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => { 
                        setSelectedBranch(branch); 
                        setShowDelete(true); 
                      }}
                      className="action-btn delete-btn"
                      title="Delete Branch"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="branch-content">
                  <h3 className="branch-name">{branch.name}</h3>
                  <div className="branch-id">ID: {branch.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBranches.length)} of {filteredBranches.length} results
            </div>
            <div className="pagination-buttons">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <FaChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={showDelete}
        title="Delete Branch"
        message={`Are you sure you want to delete "${selectedBranch?.name}"?`}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      <BranchFormModal
        isOpen={modalOpen}
        toggle={() => { 
          setModalOpen(false); 
          setSelected(null); 
          setError(null);
        }}
        onSubmit={selected ? handleUpdate : handleCreate}
        initialData={selected}
        error={error}
      />
    </div>
  );
};

export default OrganizationListPage;
