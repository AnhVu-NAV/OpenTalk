import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { uploadMaterial } from "../../api/apiList";

function MeetingMaterial({
  show,
  onHide,
  files,
  onUpload,
  onDelete,
  onSave,
  onBack,
  userId,
  meetingId,
}) {
  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [];

    for (const file of selectedFiles) {
      try {
        const response = await uploadMaterial(file, userId, meetingId);
        newFiles.push({ name: file.name, url: response.data });
        onUpload(newFiles);
      } catch (err) {
        console.error("File upload failed", err);
        alert("File upload failed");
      }
    }
  };

  return (
    <Modal
      id="meeting-material-modal"
      show={show}
      onHide={onHide}
      centered
      size="lg"
      contentClassName="meeting-material-modal-content"
    >
      <Modal.Body className="py-4 px-4" id="meeting-material-modal-body">
        {/* PERSONAL DOCUMENTS HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4" id="meeting-header">
          <span className="fw-semibold" style={{ fontSize: 20 }}>
            Upload Meeting Materials
          </span>
        </div>
        {/* DRAG AND DROP AREA */}
        <div className="material-dropzone" id="file-dropzone">
          <label className="material-upload-btn" htmlFor="file-upload">
            <i className="bi bi-upload me-2"></i>
            Upload File
            <input
              id="file-upload"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {/* PAYSLIPS LIST */}
        <div className="fw-semibold mt-4 mb-2" style={{ fontSize: 19 }} id="document-list-header">
          Document List
        </div>
        <Table hover className="mb-2" id="document-table">
          <thead>
            <tr>
              <th style={{ width: "65%" }}>Document Name</th>
              <th className="text-end" style={{ width: "35%" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center text-muted">
                  No file uploaded.
                </td>
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
                    id={`download-btn-${file.name}-${idx}`}
                  >
                    <i className="bi bi-download" />
                  </Button>
                  <Button
                    variant="outline-danger"
                    style={{ padding: "5px 9px" }}
                    tabIndex={-1}
                    title="Delete"
                    onClick={() => onDelete(idx)}
                    id={`delete-btn-${file.name}-${idx}`}
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
      <div className="d-flex justify-content-end gap-2 px-4 pb-4" id="footer-buttons">
        <Button
          variant="secondary"
          onClick={onBack || onHide}
          style={{ minWidth: 100 }}
          id="back-btn"
        >
          Back
        </Button>
        <Button
          className="btn-dark-green"
          onClick={onSave}
          style={{ minWidth: 100 }}
          id="save-btn"
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