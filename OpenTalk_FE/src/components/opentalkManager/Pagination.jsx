import React from "react";

// Pagination kiểu Figma, bo tròn, tối giản
function OpenTalkPagination({ page, totalPages, onPageChange }) {
  // Helper: Tạo mảng các trang hiển thị
  const getPages = () => {
    const arr = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
    } else {
      if (page <= 3) {
        arr.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 2) {
        arr.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        arr.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return arr;
  };

  const pages = getPages();

  return (
    <>
      <ul className="pagination-opentalk d-flex align-items-center gap-2 list-unstyled mb-0">
        <li>
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous"
          >
            &lt;
          </button>
        </li>
        {pages.map((p, idx) =>
          p === "..." ? (
            <li key={idx} className="pagination-ellipsis">...</li>
          ) : (
            <li key={idx}>
              <button
                className={`pagination-btn${page === p ? " active" : ""}`}
                onClick={() => onPageChange(p)}
                disabled={page === p}
              >
                {p}
              </button>
            </li>
          )
        )}
        <li>
          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next"
          >
            &gt;
          </button>
        </li>
      </ul>

      {/* CSS in component, bạn có thể copy vào file css global cũng được */}
      {/* <style>{`
        .pagination-opentalk {
          gap: 12px;
          padding: 0;
        }
        .pagination-btn {
          background: #fff;
          border: none;
          border-radius: 10px;
          min-width: 38px;
          height: 38px;
          font-size: 16px;
          font-weight: 500;
          color: #222;
          transition: background 0.15s;
          outline: none;
        }
        .pagination-btn:hover:not(:disabled) {
          background: #f3f6fa;
        }
        .pagination-btn.active,
        .pagination-btn:disabled {
          background: #f3f6fa;
          color: #222;
          font-weight: 600;
          cursor: default;
        }
        .pagination-ellipsis {
          color: #bbb;
          font-size: 16px;
          min-width: 18px;
          text-align: center;
          user-select: none;
        }
      `}</style> */}
    </>
  );
}

export default OpenTalkPagination;
