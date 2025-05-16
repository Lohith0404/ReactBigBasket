import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SoftDrinks({ searchTerm }) {
  const dispatch = useDispatch();
  const allSoftDrinks = useSelector(state => state.products.softDrinks);

  const [filteredItems, setFilteredItems] = useState(allSoftDrinks);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = term
      ? allSoftDrinks.filter(item =>
          item.name.toLowerCase().includes(term)
        )
      : allSoftDrinks;

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, allSoftDrinks]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="page">
      <h2>Soft Drinks</h2>
      <div className="product-grid">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item, idx) => (
            <div className="card" key={idx}>
              <img src={item.image} alt={item.name} className="product-image" />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No items match “{searchTerm}”.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              className={currentPage === idx + 1 ? 'active' : ''}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default SoftDrinks;
