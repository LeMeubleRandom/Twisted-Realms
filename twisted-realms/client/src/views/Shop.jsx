import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../assets/css/shop.css";

function Shop({ user }) {
  const [activeTab, setActiveTab] = useState("Pack");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shopItems, setShopItems] = useState(null);

  /*if (!user) {
    return <Navigate to="/login" replace />;
  }*/

  const categories = ["Recommended", "Pack", "Structure Deck"];

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/shop/items", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setShopItems(data);
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  let currentItems = [];
  if (shopItems) {
    if (activeTab === "Recommended") {
      const recommendedDecks = (shopItems.decks || []).filter(
        (item) => item.recommanded,
      );
      const recommendedPacks = (shopItems.packs || []).filter(
        (item) => item.recommanded,
      );
      currentItems = [...recommendedDecks, ...recommendedPacks];
    } else if (activeTab === "Pack") {
      currentItems = shopItems.packs || [];
    } else if (activeTab === "Structure Deck") {
      currentItems = shopItems.decks || [];
    }
  }

  return (
    <main className="shop-container">
      <div className="shop-header">
        <h2>Boutique</h2>
        <div className="user-points">
          <span>Points : </span>
          <span className="points-amount">{user.credits || 0}</span>
        </div>
      </div>

      <div className="shop-main-layout">
        {isSidebarOpen && (
          <div
            className="shop-sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <button
          className={`shop-sidebar-toggle ${isSidebarOpen ? "open" : ""}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={
            isSidebarOpen ? "Fermer les catégories" : "Ouvrir les catégories"
          }
        >
          <svg
            className={`toggle-arrow ${isSidebarOpen ? "open" : ""}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isSidebarOpen ? (
              <polyline points="9 5 16 12 9 19"></polyline>
            ) : (
              <polyline points="15 5 8 12 15 19"></polyline>
            )}
          </svg>
        </button>

        <div className={`shop-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <h3>Catégories</h3>
          <div className="shop-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`shop-tab ${category.toLowerCase().replace(" ", "-")} ${activeTab === category ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(category);
                  setIsSidebarOpen(false);
                }}
              >
                <span className="tab-text">{category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="shop-content">
          <div className="active-category-header">
            <h3>{activeTab}</h3>
          </div>

          <div className="shop-items-grid">
            {currentItems.map((item) => (
              <div key={`${item.type}-${item.id}`} className="shop-item-card">
                {item.badge && <span className="item-badge">{item.badge}</span>}
                <div className="item-type">{item.type}</div>
                <h4 className="item-name">{item.name}</h4>
                <p className="item-description">{item.description}</p>
                <div className="item-footer">
                  <div className="item-price">
                    <span className="price-val">{item.price}</span> pts
                  </div>
                  <button
                    className="buy-btn"
                    onClick={() =>
                      alert(
                        `Achat de : ${item.name} pour ${item.price} points.`,
                      )
                    }
                  >
                    Acheter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Shop;
