import styles from "./Pagination.module.css"

// Pagination kiểu Figma, bo tròn, tối giản
function OpenTalkPagination({ page, totalPages, onPageChange }) {
  // Helper: Tạo mảng các trang hiển thị
  const getPages = () => {
    const arr = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) arr.push(i)
    } else {
      if (page <= 3) {
        arr.push(1, 2, 3, "...", totalPages)
      } else if (page >= totalPages - 2) {
        arr.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      } else {
        arr.push(1, "...", page - 1, page, page + 1, "...", totalPages)
      }
    }
    return arr
  }

  const pages = getPages()

  return (
      <div className={styles.pagination}>
        <button
            className={styles.navBtn}
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous"
        >
          ‹
        </button>

        {pages.map((p, idx) =>
            p === "..." ? (
                <span key={idx} className={styles.ellipsis}>
            ...
          </span>
            ) : (
                <button
                    key={idx}
                    className={`${styles.paginationBtn} ${page === p ? styles.active : ""}`}
                    onClick={() => onPageChange(p)}
                    disabled={page === p}
                >
                  {p}
                </button>
            ),
        )}

        <button
            className={styles.navBtn}
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next"
        >
          ›
        </button>
      </div>
  )
}

export default OpenTalkPagination
