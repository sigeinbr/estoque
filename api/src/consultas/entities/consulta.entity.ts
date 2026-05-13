import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConsultaParametro } from './consulta-parametro.entity';

@Entity({ schema: 'adm', name: 'consultas' })
export class Consulta {
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
  sql_consulta: string;

  @OneToMany(
    () => ConsultaParametro,
    (consultaParametro) => consultaParametro.consulta,
    { eager: true },
  )
  parametros: ConsultaParametro[];
}
