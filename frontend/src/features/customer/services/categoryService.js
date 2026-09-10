import api from "../../../services/api";
import { mockCategories } from "../data/mockCategories";

const USE_MOCK = true;

export function getCategories() {
  if (USE_MOCK) {
    return Promise.resolve(mockCategories);
  }
  return api.get("/categories").then((res) => res.data.categories);
}