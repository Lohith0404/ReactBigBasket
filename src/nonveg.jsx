import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NonVeg({ searchTerm, setSearchTerm }) {
  const dispatch = useDispatch();
  const allNonVegItems = useSelector(state => state.products.nonVeg);

  const [filteredItems, setFilteredItems] = useState(allNonVegItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(1000);
  const itemsPerPage = 4;

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = allNonVegItems.filter(item => {
      const isInPriceRange = item.price <= priceRange;
      const matchesSearchTerm = item.name.toLowerCase().includes(term);
      return isInPriceRange && matchesSearchTerm;
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, allNonVegItems, priceRange]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleClearFilters = () => {
    setPriceRange(1000);
    setSearchTerm('');
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="page">
      <h2>Non-Veg Items</h2>

      {/* Price Range Slider */}
      <div className="price-filter">
        <label>
          Price Range: ₹0 - ₹{priceRange}
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange}
            onChange={(e) => setPriceRange(+e.target.value)}
            step="10"
          />
        </label>
        <button onClick={handleClearFilters} className="clear-button">
          Clear Filters
        </button>
      </div>

      <div className="product-grid">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item, idx) => (
            <div className="card" key={idx}>
              <img src={item.image} alt={item.name} className="product-image" />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <button onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No items match your search or price filter.</p>
        )}
      </div>

      {/* Pagination */}
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

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default NonVeg;
