import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'adm', name: 'relatorios' })
export class Relatorio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;
}
