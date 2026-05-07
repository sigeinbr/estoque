import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'adm', name: 'ugs' })
export class Ug {
  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  @Column()
  deleted_by: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column()
  cnpj: string;

  @Column()
  nome: string;

  @Column()
  sigla: string;
}
