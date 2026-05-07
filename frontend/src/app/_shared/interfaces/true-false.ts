export interface TrueFalse {
  label?: string;
  value?: boolean;
}

export function loadTrueFalse() {
  return [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];
}
