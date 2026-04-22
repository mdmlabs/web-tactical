import { ref, onMounted } from "vue";
import { fetchSitesFlat } from "@/api/clients";
import { formatSiteOptions } from "@/utils/format";

export function useSiteDropdown(onMount = false) {
  const site = ref(null);
  const sites = ref([]);
  const siteOptions = ref([]);

  async function getSiteOptions(flat = false) {
    const data = await fetchSitesFlat();
    if (flat) {
      siteOptions.value = data.map((s) => ({ label: s.name, value: s.id }));
    } else {
      siteOptions.value = formatSiteOptions(data);
    }
  }

  if (onMount) onMounted(getSiteOptions);

  return {
    //data
    site,
    sites,
    siteOptions,

    //methods
    getSiteOptions,
  };
}

export function useParentSiteDropdown(onMount = false) {
  const parentSite = ref(null);
  const parentSiteOptions = ref([]);

  async function getParentSiteOptions() {
    const data = await fetchSitesFlat();
    parentSiteOptions.value = data.map((s) => ({
      label: s.ancestors ? `${s.ancestors} / ${s.name}` : s.name,
      value: s.master_id,
      id: s.id,
    }));
  }

  if (onMount) onMounted(getParentSiteOptions);

  return {
    parentSite,
    parentSiteOptions,
    getParentSiteOptions,
  };
}
