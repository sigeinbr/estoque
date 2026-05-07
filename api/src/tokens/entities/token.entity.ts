import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Tipo {
  validacao_email = 'validacao_email',
  recuperacao_senha = 'recuperacao_senha',
}

@Entity({ schema: 'adm', name: 'tokens' })
export class Token {
  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  @Column()
  deleted_by: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  validade: Date;

  @Column()
  tipo: Tipo;

  @Column({ type: 'jsonb' })
  parametros: any;

  @Column()
  ativo: boolean;
}
