import React, { useState } from "react";
import { View, Modal, Alert } from "react-native";
import { useTheme } from "../../stores/themeStore";
import { db } from "../../services/tinybaseStore";

// Components
import ModalHeader from "./ModalHeader";
import StepIndicator from "./StepIndicator";
import StepTitle from "./StepTitle";
import CategoryStep from "./CategoryStep";
import ProductDetailsStep from "./ProductDetailsStep";
import StockStep from "./StockStep";
import ReviewStep from "./ReviewStep";
import Navigation from "./Navigation";

// Types and Constants
import type { AddProductModalProps, ProductFormData } from "./types";
import { STEPS, INITIAL_FORM_DATA } from "./constants";

export default function AddProductModal({
  visible,
  onClose,
  onSubmit,
}: AddProductModalProps) {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    try {
      // Validate required fields
      if (
        !formData.name.trim() ||
        !formData.sku.trim() ||
        !formData.price.trim() ||
        !formData.initialStock.trim()
      ) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      // Parse numeric values
      const price = parseFloat(formData.price);
      const cost = formData.cost ? parseFloat(formData.cost) : undefined;
      const initialStock = parseInt(formData.initialStock);

      if (isNaN(price) || price <= 0) {
        Alert.alert("Error", "Please enter a valid price.");
        return;
      }

      if (isNaN(initialStock) || initialStock < 0) {
        Alert.alert("Error", "Please enter a valid stock quantity.");
        return;
      }

      // Add product to database
      const productId = db.addProduct({
        name: formData.name.trim(),
        description: formData.description.trim(),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim() || undefined,
        brand: formData.brand.trim() || undefined,
        category: formData.categoryId,
        price: price,
        cost: cost,
        initialStock: initialStock,
      });

      console.log("Product created with ID:", productId);

      // Call parent onSubmit callback with the created product data
      onSubmit(formData);

      Alert.alert("Success", "Product added successfully!", [
        { text: "OK", onPress: onClose },
      ]);
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product. Please try again.");
    }
  };

  const updateFormData = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.categoryId !== "";
      case 2:
        return formData.name.trim() !== "" && formData.sku.trim() !== "";
      case 3:
        return (
          formData.price.trim() !== "" && formData.initialStock.trim() !== ""
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      onUpdate: updateFormData,
      onNext: handleNext,
      onPrevious: handlePrevious,
    };

    switch (currentStep) {
      case 1:
        return <CategoryStep {...stepProps} />;
      case 2:
        return <ProductDetailsStep {...stepProps} />;
      case 3:
        return <StockStep {...stepProps} />;
      case 4:
        return <ReviewStep {...stepProps} />;
      default:
        return <CategoryStep {...stepProps} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        className={`flex-1 ${
          isDark ? "bg-background-dark" : "bg-background-light"
        }`}
      >
        {/* Header */}
        <ModalHeader onClose={onClose} />

        {/* Content */}
        <View className="flex-1 px-4 pt-4">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />
          <StepTitle step={STEPS[currentStep - 1]} />
          {renderCurrentStep()}
        </View>

        {/* Navigation */}
        <Navigation
          currentStep={currentStep}
          totalSteps={STEPS.length}
          canProceed={canProceed()}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </View>
    </Modal>
  );
}
