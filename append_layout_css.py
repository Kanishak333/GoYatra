with open('src/index.css', 'a') as f:
    f.write('''

/* ========================================= */
/* Plan Trip - MakeMyTrip Style Layout       */
/* ========================================= */

.search-layout-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  align-items: start;
}

/* Sidebar Styles */
.sidebar-filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 100px;
}

.map-box {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  height: 140px;
  background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.1);
}

.map-box::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15,23,42,0.4);
}

.map-btn {
  position: relative;
  z-index: 10;
  background: white;
  color: #ff5a00;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

.map-btn:hover {
  transform: scale(1.05);
}

.filter-section {
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
}

.filter-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.filter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
  color: #cbd5e1;
  font-size: 0.95rem;
  cursor: pointer;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.filter-item:hover {
  color: white;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 4px;
  background: rgba(0,0,0,0.2);
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"]:checked {
  background: #ff5a00;
  border-color: #ff5a00;
}

.checkbox-label input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  background: rgba(0,0,0,0.2);
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.radio-label input[type="radio"]:checked {
  border-color: #ff5a00;
}

.radio-label input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ff5a00;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.filter-count {
  color: #64748b;
  font-size: 0.85rem;
}

/* Right Content Styles */
.results-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.results-title {
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
}

.explore-tips-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background 0.2s;
}

.explore-tips-btn:hover {
  background: rgba(255,255,255,0.2);
}

.sorting-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(15,23,42,0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 1.5rem;
  overflow-x: auto;
  white-space: nowrap;
}

.sort-pill {
  color: #94a3b8;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  transition: all 0.2s;
}

.sort-pill:hover {
  color: white;
  background: rgba(255,255,255,0.05);
}

.sort-pill.active {
  color: #ff5a00;
  background: rgba(255,90,0,0.1);
  font-weight: 600;
}

.promo-banner {
  background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(15,23,42,0.6));
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.promo-logo {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #059669, #022c22);
  border-radius: 50%;
  border: 4px solid rgba(16,185,129,0.3);
}

.promo-content h4 {
  color: white;
  margin: 0 0 0.4rem 0;
  font-size: 1.2rem;
}

.promo-content p {
  color: #a7f3d0;
  margin: 0;
  font-size: 0.95rem;
}

/* Horizontal Hotel Card */
.horizontal-hotel-card {
  display: flex;
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  height: 260px;
}

.horizontal-hotel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
  border-color: rgba(255,90,0,0.3);
}

.hhc-image-section {
  width: 320px;
  position: relative;
  flex-shrink: 0;
}

.hhc-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hhc-photo-badge {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.hhc-info-section {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.hhc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.hhc-name {
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.4rem 0;
}

.hhc-location {
  color: #94a3b8;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.hhc-perks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.hhc-perk {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #22c55e;
  font-size: 0.9rem;
}

.hhc-price-section {
  width: 220px;
  padding: 1.5rem;
  border-left: 1px dashed rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  background: rgba(0,0,0,0.2);
}

.hhc-rating-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.rating-score-box {
  background: #1e3a8a;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.2rem;
}

.rating-text {
  color: #94a3b8;
  font-size: 0.8rem;
}

.hhc-price-box {
  text-align: right;
  width: 100%;
}

.hhc-price {
  color: white;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.hhc-taxes {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.hhc-book-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff5a00, #ff8a00);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.hhc-book-btn:hover {
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .search-layout-container {
    grid-template-columns: 1fr;
  }
  .sidebar-filters {
    display: none; /* In a real app, this would be a mobile drawer */
  }
  .horizontal-hotel-card {
    flex-direction: column;
    height: auto;
  }
  .hhc-image-section {
    width: 100%;
    height: 200px;
  }
  .hhc-price-section {
    width: 100%;
    border-left: none;
    border-top: 1px dashed rgba(255,255,255,0.1);
    align-items: flex-start;
    flex-direction: row;
  }
  .hhc-rating-badge {
    align-items: flex-start;
  }
  .hhc-price-box {
    text-align: right;
    width: auto;
  }
  .hhc-book-btn {
    width: auto;
    padding: 0.8rem 2rem;
  }
}
''')
print("Appended layout CSS for PlanTrip")
