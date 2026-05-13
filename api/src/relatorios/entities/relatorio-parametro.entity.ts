import { TipoCampoEnum } from 'src/_shared/enums/tipo-campo.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Relatorio } from './relatorio.entity';

@Entity({ schema: 'adm', name: 'relatorios_parametros' })
export class RelatorioParametro {
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
  relatorio_id: number;

  @ManyToOne(() => Relatorio, (relatorio) => relatorio.parametros)
  @JoinColumn({ name: 'relatorio_id' })
  relatorio: Relatorio;

  @Column()
  ordem: number;

  @Column()
  variavel: string;

  @Column()
  nome: string;

  @Column()
  tipo_campo: TipoCampoEnum;

  @Column()
  tamanho: number;

  @Column()
  valor_padrao: string;

  @Column()
  obrigatorio: boolean;

  @Column()
  sql_lista: string;

  @Column({ type: 'jsonb' })
  json_lista: string;
}
