import { TreeNode } from './interfaces/tree-node';
import { Menu } from './services/api/menus.service';

export default class HelperFunctions {
  static findIndexById(id: any, data: any[], column: string): number {
    let index = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i][column] === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  static buildMenus(menus: Menu[], menuPaiId: string | null): Menu[] {
    const menuFilhos = menus.filter((item) => item.menuPaiId === menuPaiId);
    const tree = menuFilhos.map((menuItem) => {
      const newItem: Menu = {
        ...menuItem,
        items: this.buildMenus(menus, menuItem.id),
      };
      return newItem;
    });

    return tree;
  }

  static buildNodes(
    treeNodes: TreeNode[],
    menuPaiId: string | null
  ): TreeNode[] {
    const menuFilhos = treeNodes.filter((item) => item.menuPaiId === menuPaiId);
    const tree = menuFilhos.map((menuItem) => {
      const newItem: TreeNode = {
        ...menuItem,
        children: this.buildNodes(treeNodes, menuItem.key),
      };
      return newItem;
    });

    return tree;
  }

  static convertToCSV(data: any[], headers: string[]): string {
    const csvContent = [headers.join(';')].concat(
      data
        .map((row) => {
          const rowValues = headers.map((header) => {
            const value = row[header] ?? '';
            return `"${value.toString().replace(/"/g, '""')}"`;
          });
          return rowValues.join(';');
        })
        .join('\n')
    );

    return `\ufeff${csvContent.join('\n')}`;
  }

  static downloadCSV(csvString: string, filename: string) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  static downloadPDF(
    blob: Blob,
    filename: string,
    openInNewTab: boolean = true
  ) {
    const url = window.URL.createObjectURL(blob);

    if (openInNewTab) {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static parseFilename(titulo: string): string {
    // Substitui caracteres especiais
    let parsedName = titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
    parsedName = parsedName.replace(/ç/g, 'c'); // Substitui ç por c
    parsedName = parsedName.replace(/[^a-zA-Z0-9\s.-]/g, ''); // Remove caracteres inválidos
    parsedName = parsedName.replace(/\s+/g, '-'); // Substitui espaços por hífens

    return parsedName;
  }

  static formatDate(date: Date): string {
    // Format date as 'yyyy-MM-dd'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  static formatDateBr(date: Date | string): string {
    const data = this.parseDate(date);

    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  static isObject = (value: null) => {
    return value !== null && typeof value === 'object';
  };

  static parseDate(date: Date | string | null | undefined): Date {
    if (date instanceof Date) {
      return new Date(date.getTime());
    }

    if (date === null || date === undefined) {
      return new Date('');
    }

    const value = String(date).trim();
    if (!value) {
      return new Date('');
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T00:00:00`);
    }

    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(value)) {
      return new Date(value.replace(' ', 'T'));
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }

    const parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map((part) => Number(part));
      if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
        return new Date(year, month - 1, day);
      }
    }

    return new Date(value);
  }

  static tryParseDate(
    value: Date | string | null | undefined
  ): Date | undefined {
    if (value instanceof Date) {
      return value;
    }

    if (value === null || value === undefined) {
      return undefined;
    }

    const trimmedValue = String(value).trim();

    if (!trimmedValue) {
      return undefined;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
      const [year, month, day] = trimmedValue.split('-').map(Number);
      return new Date(year, (month ?? 1) - 1, day ?? 1);
    }

    const parsed = new Date(trimmedValue);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
}
