export interface TableColumn {
    field: string;
    header: string;
    width?: string;
    sortable?: boolean;
    filter?: string;
    align?: string;
    sortField?: string;
    type?: string;
    currency?: string;
}