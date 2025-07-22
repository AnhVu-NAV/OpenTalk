import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

function MeetingMaterial({
  show,
  onHide,
  files,
  onUpload,
  onDelete,
  onSave,     
  onBack,     
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      contentClassName="meeting-material-modal-content"
    >
      <Modal.Body className="py-4 px-4">
        {/* PERSONAL DOCUMENTS HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="fw-semibold" style={{ fontSize: 20 }}>
            Upload Meeting Materials
          </span>
        </div>
        {/* DRAG AND DROP AREA */}
        <div className="material-dropzone">
          <div className="dropzone-icon" style={{ marginBottom: 10 }}>
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                <rect x="9" y="25" width="50" height="34" rx="4" fill="#E9F7F1" stroke="#30B183" strokeWidth="2"/>
                <path d="M34 44V15" stroke="#30B183" strokeWidth="3" strokeLinecap="round"/>
                <path d="M28 22L34 15L40 22" stroke="#30B183" strokeWidth="3" strokeLinecap="round"/>
                <rect x="18" y="57" width="32" height="4" rx="2" fill="#E0E0E0"/>
            </svg>
          </div>
          <div className="fw-bold" style={{ fontSize: 22 }}>
            Drag &amp; Drop here to upload
          </div>
          <div style={{ color: "#555", fontSize: 15, marginBottom: 14 }}>
            Or select file from your computer
          </div>
          <label className="material-upload-btn">
            <i className="bi bi-upload me-2"></i>
            Upload File
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={onUpload}
            />
          </label>
        </div>
        {/* PAYSLIPS LIST */}
        <div className="fw-semibold mt-4 mb-2" style={{ fontSize: 19 }}>
          Document List
        </div>
        <Table hover className="mb-2">
          <thead>
            <tr>
              <th style={{ width: "65%" }}>Document Name</th>
              <th className="text-end" style={{ width: "35%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center text-muted">No file uploaded.</td>
              </tr>
            )}
            {files.map((file, idx) => (
              <tr key={file.name + idx}>
                <td>{file.name}</td>
                <td className="text-end">
                  <Button
                    variant="outline-primary"
                    style={{ padding: "5px 9px", marginRight: 8 }}
                    tabIndex={-1}
                    title="Download"
                  >
                    <i className="bi bi-download" />
                  </Button>
                  <Button
                    variant="outline-danger"
                    style={{ padding: "5px 9px" }}
                    tabIndex={-1}
                    title="Delete"
                    onClick={() => onDelete(idx)}
                  >
                    <i className="bi bi-trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      {/* Nút SAVE và BACK cố định góc phải dưới */}
      <div className="d-flex justify-content-end gap-2 px-4 pb-4">
        <Button
          variant="secondary"
          onClick={onBack || onHide}
          style={{ minWidth: 100 }}
        >
          Back
        </Button>
        <Button
          className="btn-dark-green"
          onClick={onSave}
          style={{ minWidth: 100 }}
        >
          Save
        </Button>
      </div>

      <style>{`
        .material-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1.8px dashed #c9c9c9;
          border-radius: 13px;
          background: #fafbfc;
          margin-bottom: 14px;
          padding: 30px 0 20px 0;
        }
        .dropzone-icon {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .material-upload-btn {
          margin-top: 4px;
          background: #181f29;
          color: #fff;
          border-radius: 7px;
          font-weight: 500;
          padding: 9px 28px;
          font-size: 17px;
          display: inline-block;
          cursor: pointer;
          border: none;
        }
        .material-upload-btn:hover, .material-upload-btn:focus {
          background: #19406c;
        }
        .meeting-material-modal-content {
          border-radius: 18px !important;
        }
      `}</style>
    </Modal>
  );
}

export default MeetingMaterial;
