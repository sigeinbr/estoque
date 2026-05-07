import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'adm', name: 'modulos' })
export class Modulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;
}
