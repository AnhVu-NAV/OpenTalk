import { FiDownload, FiPlus, FiSearch, FiXCircle } from "react-icons/fi";
import { Form, Row, Col, Button } from "react-bootstrap";

function OpenTalkHeader({
  onAddNew,
  searchName,
  onChangeName,
  selectedBranch,
  onChangeBranch,
  branches = [],
  selectedStatus,
  onChangeStatus,
  statuses = [],
  date,
  onChangeDate,
  fromDate,
  onChangeFromDate,
  toDate,
  onChangeToDate,
  onSearch,
  onClear, 
}) {
  return (
    <div className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: 32 }}>OpenTalk Meeting</h2>
          <div className="text-muted" style={{ fontSize: 18 }}>Manage your Meetings</div>
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-light rounded-4 shadow-sm py-2 px-4 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: 18 }}>
            <FiDownload size={20} /> Download
          </button>
          <button className="btn btn-dark rounded-4 shadow-sm py-2 px-4 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: 18 }} onClick={onAddNew}>
            <FiPlus size={20} /> Add New
          </button>
        </div>
      </div>

      <Form
        onSubmit={e => {
          e.preventDefault();
          onSearch && onSearch();
        }}
      >
        <Row className="align-items-end mb-1 g-2">
          <Col xs={12} md={2}>
            <Form.Label className="fw-semibold mb-1" htmlFor="search-name">Meeting Name</Form.Label>
            <Form.Control
              id="search-name"
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={e => onChangeName(e.target.value)}
            />
          </Col>
          <Col xs={6} md={2}>
            <Form.Label className="fw-semibold mb-1">Company Branch</Form.Label>
            <Form.Select value={selectedBranch} onChange={e => onChangeBranch(e.target.value)}>
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Form.Label className="fw-semibold mb-1">Status</Form.Label>
            <Form.Select value={selectedStatus} onChange={e => onChangeStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Form.Label className="fw-semibold mb-1">Exact Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={e => onChangeDate(e.target.value)}
              placeholder="Exact Date"
            />
          </Col>
          <Col xs={6} md={2}>
            <Form.Label className="fw-semibold mb-1">From</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={e => onChangeFromDate(e.target.value)}
              placeholder="From"
            />
          </Col>
          <Col xs={6} md={2}>
            <Form.Label className="fw-semibold mb-1">To</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={e => onChangeToDate(e.target.value)}
              placeholder="To"
            />
          </Col>
        </Row>
        <Row className="mb-3 g-2 mt-2">
          <Col xs={12} className="d-flex gap-2 justify-content-start">
            <Button
              type="submit"
              variant="success"
              className="fw-semibold rounded-4 px-4 py-2"
              style={{ fontSize: 16, minWidth: 120 }}
            >
              <FiSearch style={{ marginRight: 8, marginTop: -3 }} />
              Search
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              className="fw-semibold rounded-4 px-4 py-2"
              style={{ fontSize: 16, minWidth: 120 }}
              onClick={onClear}
            >
              <FiXCircle style={{ marginRight: 8, marginTop: -3 }} />
              Clear
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
export default OpenTalkHeader;
