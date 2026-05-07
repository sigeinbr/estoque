import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'adm', name: 'consultas' })
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;
}
