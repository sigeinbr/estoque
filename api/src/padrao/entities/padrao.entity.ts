import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'comum', name: 'padrao' })
export class Padrao {
  @Column()
  created_by: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column()
  updated_by: string;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_by: string;

  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ type: 'smallint' })
  ug_id: number;

  @Column({ name: 'campo_inteiro', type: 'integer' })
  campoInteiro: number;

  @Column({ name: 'campo_texto_curto', length: 100, nullable: true })
  campoTextoCurto: string;

  @Column({ name: 'campo_texto_longo', type: 'text', nullable: true })
  campoTextoLongo: string;

  @Column({ name: 'campo_data', type: 'date', nullable: true })
  campoData: Date;

  @Column({ name: 'campo_datahora', type: 'timestamp', nullable: true })
  campoDatahora: Date;

  @Column({ name: 'campo_boolean', type: 'boolean', nullable: true })
  campoBoolean: boolean;

  @Column({ name: 'campo_numeric', type: 'numeric', precision: 15, scale: 2, nullable: true })
  campoNumeric: number;

  @Column({
    name: 'campo_arquivo',
    type: 'bytea',
    nullable: true,
    transformer: {
      to: (value: string | null) => (value ? Buffer.from(value, 'base64') : null),
      from: (value: Buffer | null) => (value ? value.toString('base64') : null),
    },
  })
  campoArquivo: string;

  @Column({ name: 'campo_json', type: 'jsonb', nullable: true })
  campoJson: object;
}
