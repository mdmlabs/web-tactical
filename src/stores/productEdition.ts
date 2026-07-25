import { defineStore } from "pinia";
import axios from "axios";

import {
  BUILD_PRODUCT_EDITION,
  BUILD_PRODUCT_NAME,
  LIGHT_CAPABILITIES,
} from "@/config/productEdition";

interface ProductEditionResponse {
  product: string;
  edition: "full" | "light";
  capabilities: string[];
  capability_enforcement: string;
}

export const useProductEditionStore = defineStore("productEdition", {
  state: () => ({
    edition: BUILD_PRODUCT_EDITION as "full" | "light",
    productName: BUILD_PRODUCT_NAME,
    capabilities:
      BUILD_PRODUCT_EDITION === "light"
        ? ([...LIGHT_CAPABILITIES] as string[])
        : ([] as string[]),
    enforcement:
      BUILD_PRODUCT_EDITION === "light" ? "build" : "disabled",
    loaded: false,
  }),
  getters: {
    isLight: (state) => state.edition === "light",
    hasCapability: (state) => (capability: string) =>
      state.edition !== "light" || state.capabilities.includes(capability),
  },
  actions: {
    async load() {
      try {
        const { data } = await axios.get<ProductEditionResponse>(
          "/core/product-edition/",
        );
        this.edition = data.edition;
        this.productName = data.product;
        this.capabilities = Array.isArray(data.capabilities)
          ? data.capabilities
          : [];
        this.enforcement = data.capability_enforcement || "server";
      } finally {
        this.loaded = true;
      }
    },
  },
});
