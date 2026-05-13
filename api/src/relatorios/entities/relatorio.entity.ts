import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RelatorioParametro } from './relatorio-parametro.entity';

@Entity({ schema: 'adm', name: 'relatorios' })
export class Relatorio {
  @Column()
  created_by: string;

  @Column({ type: 'date' })
  created_at: Date;

  @Column()
  updated_by: string;

  @Column({ type: 'date' })
  updated_at: Date;

  @Column()
  deleted_by: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modulo_id: number;

  @Column()
  titulo: string;

  @Column()
  is_padrao: boolean;

  @Column()
  descricao: string;

  @Column()
  arquivo: string;

  @OneToMany(
    () => RelatorioParametro,
    (relatorioParametro) => relatorioParametro.relatorio,
    { eager: true },
  )
  parametros: RelatorioParametro[];
}
