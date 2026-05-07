import { GrupoPermissao } from 'src/grupos-permissoes/entities/grupos-permissoes.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { UsuarioModulo } from './usuario-modulo.entity';
import { UsuarioUg } from './usuario-ug.entity';

@Entity({ schema: 'adm', name: 'usuarios' })
export class Usuario {
  @Column()
  created_by: string;

  @Column()
  created_at: Date;

  @Column()
  updated_by: string;

  @Column()
  updated_at: Date;

  @Column()
  deleted_by: string;

  @PrimaryColumn({ update: false })
  login: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  cpf: string;

  @Column()
  is_verificado: boolean;

  @ManyToMany(() => GrupoPermissao, (grupoPermissao) => grupoPermissao.usuarios)
  grupos_permissoes: GrupoPermissao[];

  @OneToMany(() => UsuarioUg, (usuarioUg) => usuarioUg.usuario)
  ugs: UsuarioUg[];

  @OneToMany(() => UsuarioModulo, (usuarioModulo) => usuarioModulo.usuario)
  modulos: UsuarioModulo[];
}
