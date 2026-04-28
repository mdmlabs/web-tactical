import { computed, type Ref } from "vue";
import type { ConfigFile, FileCategory, FileTarget } from "@/cywm/types";

export interface FileTreeGroup {
  key: string;
  target: FileTarget;
  category: FileCategory;
  label: string;
  files: ConfigFile[];
}

const GROUP_ORDER: Array<{ target: FileTarget; category: FileCategory }> = [
  { target: "manager", category: "rules" },
  { target: "manager", category: "decoders" },
  { target: "manager", category: "ossec-snippets" },
  { target: "manager", category: "shared" },
  { target: "windows-agent", category: "active-response" },
];

function groupLabel(target: FileTarget, category: FileCategory): string {
  const targetPart = target === "manager" ? "Manager" : "Windows agent";
  return `${targetPart} / ${category}`;
}

function matches(file: ConfigFile, q: string): boolean {
  if (!q) return true;
  return file.filename.toLowerCase().includes(q.toLowerCase());
}

export function useFileTree(files: Ref<ConfigFile[]>, filter: Ref<string>) {
  const groups = computed<FileTreeGroup[]>(() => {
    const q = filter.value.trim();
    return GROUP_ORDER.map(({ target, category }) => {
      const filtered = files.value.filter(
        (f) => f.target === target && f.category === category && matches(f, q),
      );
      return {
        key: `${target}/${category}`,
        target,
        category,
        label: groupLabel(target, category),
        files: filtered,
      };
    });
  });

  const totalCount = computed(() =>
    groups.value.reduce((sum, g) => sum + g.files.length, 0),
  );

  return { groups, totalCount };
}
