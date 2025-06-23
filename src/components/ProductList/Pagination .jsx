import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
        className="pagination-btn"
      >
        ⬅ Previous
      </button>
      
      <div className="pagination-numbers">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
      <button 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
        className="pagination-btn"
      >
        Next ➡
      </button>
    </div>
  );
};

export default Pagination;