import "./global.css";
import { StatusBar } from "expo-status-bar";
import React from "react";
import SafeAreaWrapper from "./components/platform/SafeAreaWrapper";
import MainLayout from "./components/layouts/MainLayout";
import LeftPanel from "./components/layouts/LeftPanel";
import RightPanel from "./components/layouts/RightPanel";
import ProductManager from "./components/ProductManager";
import CartManager from "./components/CartManager";
import Toast from "react-native-toast-message";
import type { Product } from "./types/database";

function AppContent() {
  return (
    <ProductManager>
      {({
        products,
        categories,
        loading,
        error,
        currentCategory,
        searchResults,
        isFiltering,
        visibleProducts,
        handleCategorySelect,
        handleSearch,
        clearSearch,
        isSearching,
        resetProducts,
      }) => (
        <CartManager>
          {({
            selectedProducts,
            selectedProductForQuantity,
            keypadInput,
            dailyRevenue,
            dailyProfit,
            addToCart,
            removeFromCart,
            updateQuantity,
            setSelectedProductForQuantity,
            setKeypadInput,
            getTotalAmount,
            completeSale,
          }) => {
            // Event handlers
            const handleProductPress = (product: Product) => {
              React.startTransition(() => {
                setSelectedProductForQuantity(product);
                setKeypadInput("");
              });
            };

            const handleKeypadNumber = (num: string) => {
              setKeypadInput((prev: string) => prev + num);
            };

            const handleKeypadDelete = () => {
              setKeypadInput(keypadInput.slice(0, -1));
            };

            const handleKeypadClear = () => {
              setKeypadInput("");
            };

            const handleKeypadEnter = () => {
              if (keypadInput && selectedProductForQuantity) {
                const quantity = parseInt(keypadInput);
                if (quantity > 0) {
                  addToCart(selectedProductForQuantity, quantity);
                  setSelectedProductForQuantity(null);
                  setKeypadInput("");
                }
              }
            };

            return (
              <SafeAreaWrapper className="flex-1">
                <StatusBar style="auto" />

                <MainLayout
                  leftPanel={
                    <LeftPanel
                      title="🛍️ POS Light"
                      products={visibleProducts}
                      allProducts={products}
                      categories={categories}
                      loading={loading}
                      error={error}
                      currentCategory={currentCategory}
                      searchResults={searchResults}
                      isFiltering={isFiltering}
                      onProductPress={handleProductPress}
                      onCategorySelect={handleCategorySelect}
                      onSearch={handleSearch}
                      onRefresh={resetProducts}
                      selectedProductForQuantity={selectedProductForQuantity}
                    />
                  }
                  rightPanel={
                    <RightPanel
                      selectedProducts={selectedProducts}
                      selectedProductForQuantity={selectedProductForQuantity}
                      keypadInput={keypadInput}
                      dailyRevenue={dailyRevenue}
                      dailyProfit={dailyProfit}
                      onRemoveFromCart={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                      onSetSelectedProductForQuantity={
                        setSelectedProductForQuantity
                      }
                      onSetKeypadInput={setKeypadInput}
                      onKeypadNumber={handleKeypadNumber}
                      onKeypadDelete={handleKeypadDelete}
                      onKeypadClear={handleKeypadClear}
                      onKeypadEnter={handleKeypadEnter}
                      onCompleteSale={completeSale}
                      getTotalAmount={getTotalAmount}
                    />
                  }
                />

                <Toast />
              </SafeAreaWrapper>
            );
          }}
        </CartManager>
      )}
    </ProductManager>
  );
}

export default function App() {
  return <AppContent />;
}
