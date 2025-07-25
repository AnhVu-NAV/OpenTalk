import styles from "./MeetingMaterial.module.css"

function MeetingMaterial({ show, onHide, files, onUpload, onDelete, onSave, onBack }) {
  if (!show) return null

  return (
      <div className={styles.modalOverlay} onClick={onHide}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalBody}>
            {/* PERSONAL DOCUMENTS HEADER */}
            <div className={styles.header}>
              <span className={styles.title}>Upload Meeting Materials</span>
            </div>

            {/* DRAG AND DROP AREA */}
            <div className={styles.dropzone}>
              <div className={styles.dropzoneIcon}>
                <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                  <rect x="9" y="25" width="50" height="34" rx="4" fill="#E9F7F1" stroke="#30B183" strokeWidth="2" />
                  <path d="M34 44V15" stroke="#30B183" strokeWidth="3" strokeLinecap="round" />
                  <path d="M28 22L34 15L40 22" stroke="#30B183" strokeWidth="3" strokeLinecap="round" />
                  <rect x="18" y="57" width="32" height="4" rx="2" fill="#E0E0E0" />
                </svg>
              </div>
              <div className={styles.dropzoneTitle}>Drag &amp; Drop here to upload</div>
              <div className={styles.dropzoneSubtitle}>Or select file from your computer</div>
              <label className={styles.uploadButton}>
                📤 Upload File
                <input type="file" multiple style={{ display: "none" }} onChange={onUpload} />
              </label>
            </div>

            {/* PAYSLIPS LIST */}
            <div className={styles.sectionTitle}>Document List</div>
            <table className={styles.table}>
              <thead>
              <tr>
                <th style={{ width: "65%" }}>Document Name</th>
                <th style={{ width: "35%" }}>Action</th>
              </tr>
              </thead>
              <tbody>
              {files.length === 0 && (
                  <tr>
                    <td colSpan={2} className={styles.emptyMessage}>
                      No file uploaded.
                    </td>
                  </tr>
              )}
              {files.map((file, idx) => (
                  <tr key={file.name + idx}>
                    <td>{file.name}</td>
                    <td>
                      <button className={`${styles.actionButton} ${styles.downloadButton}`} title="Download">
                        ⬇️ Download
                      </button>
                      <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          title="Delete"
                          onClick={() => onDelete(idx)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* Footer with buttons */}
          <div className={styles.footer}>
            <button className={`${styles.footerButton} ${styles.backButton}`} onClick={onBack || onHide}>
              Back
            </button>
            <button className={`${styles.footerButton} ${styles.saveButton}`} onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      </div>
  )
}

export default MeetingMaterial
