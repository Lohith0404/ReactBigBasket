import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Veg({ searchTerm }) {
  const dispatch = useDispatch();
  const allVegItems = useSelector(state => state.products.veg);

  const [filteredItems, setFilteredItems] = useState(allVegItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRanges, setSelectedRanges] = useState([]);
  const itemsPerPage = 4;

  const priceRanges = [
    { label: "Below ₹50", min: 0, max: 49 },
    { label: "₹50 - ₹100", min: 50, max: 100 },
    { label: "₹101 - ₹200", min: 101, max: 200 },
    { label: "Above ₹200", min: 201, max: Infinity }
  ];

  const handleCheckboxChange = (rangeLabel) => {
    setSelectedRanges(prev =>
      prev.includes(rangeLabel)
        ? prev.filter(r => r !== rangeLabel)
        : [...prev, rangeLabel]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedRanges([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = allVegItems;

    if (term) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term)
      );
    }

    if (selectedRanges.length > 0) {
      filtered = filtered.filter(item =>
        selectedRanges.some(label => {
          const range = priceRanges.find(r => r.label === label);
          return item.price >= range.min && item.price <= range.max;
        })
      );
    }

    setFilteredItems(filtered);
  }, [searchTerm, allVegItems, selectedRanges]);

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
      <h2>Veg Items</h2>

      <div className="filters">
        <h4>Filter by Price:</h4>
        {priceRanges.map(range => (
          <label key={range.label}>
            <input
              type="checkbox"
              value={range.label}
              checked={selectedRanges.includes(range.label)}
              onChange={() => handleCheckboxChange(range.label)}
            />
            {range.label}
          </label>
        ))}

        {selectedRanges.length > 0 && (
          <button className="clear-button" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

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

export default Veg;
