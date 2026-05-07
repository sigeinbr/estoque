import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'adm', name: 'grupos_permissoes_relatorios' })
export class GrupoPermissaoRelatorio {
  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  @Column()
  deleted_by: string;

  @PrimaryColumn()
  grupo_permissao_id: number;

  @PrimaryColumn()
  relatorio_id: number;
}
