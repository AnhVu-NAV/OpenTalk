import { useEffect, useState } from "react"
import { FaPlus, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaBuilding } from "react-icons/fa"
import BranchFormModal from "../components/companyBranchFormModal/BranchFormModal.jsx"
import DeleteModal from "../components/deleteModal/DeleteModal.jsx"
import {
  getCompanyBranches,
  createCompanyBranch,
  updateCompanyBranch,
  deleteCompanyBranch,
  getCompanyBranch,
} from "../api/companyBranch"
import styles from "./styles/module/OrganizationListPage.module.css"

const OrganizationListPage = () => {
  const [branches, setBranches] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)

  const loadData = async () => {
    try {
      const data = await getCompanyBranches()
      setBranches(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function isDuplicateName(name) {
    return branches.some(
        (branch) => branch.name.toLowerCase() === name.toLowerCase() && branch.id !== (selected ? selected.id : null),
    )
  }

  const handleCreate = async (payload) => {
    if (isDuplicateName(payload.name)) {
      setError("Branch name already exists")
    } else {
      setError(null)
      await createCompanyBranch(payload)
      setModalOpen(false)
      loadData()
    }
  }

  const handleUpdate = async (payload) => {
    if (!selected) return
    if (isDuplicateName(payload.name)) {
      setError("Branch name already exists")
    } else {
      setError(null)
      await updateCompanyBranch(selected.id, payload)
      setModalOpen(false)
      setSelected(null)
      loadData()
    }
  }

  const handleDelete = async () => {
    if (!selectedBranch) return
    await deleteCompanyBranch(selectedBranch.id)
    setShowDelete(false)
    setSelectedBranch(null)
    loadData()
  }

  const itemsPerPage = 8
  const filteredBranches = (Array.isArray(branches) ? branches : []).filter((b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage)

  return (
      <div className={styles.organizationPage}>
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaBuilding />
            </div>
            <div className={styles.headerText}>
              <h1 className={styles.pageTitle}>Organization Management</h1>
              <p className={styles.pageSubtitle}>Manage your company branches and locations</p>
            </div>
          </div>
          <button
              className={styles.addBranchBtn}
              onClick={() => {
                setSelected(null)
                setError(null)
                setModalOpen(true)
              }}
          >
            <FaPlus />
            Add Branch
          </button>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
            />
          </div>
        </div>

        <div className={styles.branchesContainer}>
          {paginatedBranches.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaBuilding />
                </div>
                <h3>No branches found</h3>
                <p>
                  {filteredBranches.length === 0 && searchTerm
                      ? `No branches match "${searchTerm}"`
                      : "Get started by adding your first branch"}
                </p>
                {filteredBranches.length === 0 && !searchTerm && (
                    <button
                        className={styles.emptyActionBtn}
                        onClick={() => {
                          setSelected(null)
                          setError(null)
                          setModalOpen(true)
                        }}
                    >
                      <FaPlus />
                      Add Your First Branch
                    </button>
                )}
              </div>
          ) : (
              <div className={styles.branchesGrid}>
                {paginatedBranches.map((branch, index) => (
                    <div key={branch.id} className={styles.branchCard}>
                      <div className={styles.branchCardHeader}>
                        <div className={styles.branchIcon}>
                          <FaBuilding />
                        </div>
                        <div className={styles.branchActions}>
                          <button
                              onClick={async () => {
                                try {
                                  const data = await getCompanyBranch(branch.id)
                                  setSelected(data)
                                  setError(null)
                                  setModalOpen(true)
                                } catch (error) {
                                  console.error("Error fetching branch:", error)
                                }
                              }}
                              className={`${styles.actionBtn} ${styles.editBtn}`}
                              title="Edit Branch"
                          >
                            <FaEdit />
                          </button>
                          <button
                              onClick={() => {
                                setSelectedBranch(branch)
                                setShowDelete(true)
                              }}
                              className={`${styles.actionBtn} ${styles.deleteBtn}`}
                              title="Delete Branch"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className={styles.branchContent}>
                        <h3 className={styles.branchName}>{branch.name}</h3>
                        <div className={styles.branchId}>ID: {branch.id}</div>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {totalPages > 1 && (
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBranches.length)} of{" "}
                  {filteredBranches.length} results
                </div>
                <div className={styles.paginationButtons}>
                  <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={styles.paginationBtn}
                  >
                    <FaChevronLeft />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                      <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`${styles.paginationNumber} ${currentPage === i + 1 ? styles.active : ""}`}
                      >
                        {i + 1}
                      </button>
                  ))}
                  <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={styles.paginationBtn}
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
              setModalOpen(false)
              setSelected(null)
              setError(null)
            }}
            onSubmit={selected ? handleUpdate : handleCreate}
            initialData={selected}
            error={error}
        />
      </div>
  )
}

export default OrganizationListPage
