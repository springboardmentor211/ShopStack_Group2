import React, { createContext, useContext, useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

const CategoryContext = createContext({ categories: [], loading: true, error: false });

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext);