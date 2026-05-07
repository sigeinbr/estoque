import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'adm', name: 'view_ugs_modulos' })
export class UgModulo {
  @PrimaryColumn()
  ug_id: number;

  @Column()
  nome: string;

  @PrimaryColumn()
  modulo_id: string;

  @Column()
  descricao: string;
}
