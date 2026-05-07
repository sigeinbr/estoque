export interface TreeNode {
  key: string;
  menuPaiId?: string | null;
  label?: string;
  icon?: string | null;
  children?: TreeNode[];
}