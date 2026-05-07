import { Consulta } from 'src/consultas/entities/consulta.entity';
import { Menu } from 'src/menus/entities/menu.entity';
import { Modulo } from 'src/modulos/entities/modulos.entity';
import { Relatorio } from 'src/relatorios/entities/relatorio.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'adm', name: 'grupos_permissoes' })
export class GrupoPermissao {
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
  descricao: string;

  @Column({ select: false })
  ug_id: number;

  @Column({ select: false })
  modulo_id: number;

  @ManyToOne(() => Modulo)
  @JoinColumn({ name: 'modulo_id' })
  modulo: Modulo;

  @Column()
  todos_menus: boolean;

  @Column()
  todos_relatorios: boolean;

  @Column()
  todas_consultas: boolean;

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'grupos_permissoes_menus',
    joinColumn: {
      name: 'grupo_permissao_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'menu_id',
      referencedColumnName: 'id',
    },
  })
  menus: Menu[];

  @ManyToMany(() => Relatorio)
  @JoinTable({
    name: 'grupos_permissoes_relatorios',
    joinColumn: {
      name: 'grupo_permissao_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'relatorio_id',
      referencedColumnName: 'id',
    },
  })
  relatorios: Relatorio[];

  @ManyToMany(() => Consulta)
  @JoinTable({
    name: 'grupos_permissoes_consultas',
    joinColumn: {
      name: 'grupo_permissao_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'consulta_id',
      referencedColumnName: 'id',
    },
  })
  consultas: Consulta[];

  @ManyToMany(() => Usuario, (usuario) => usuario.grupos_permissoes)
  @JoinTable({
    name: 'grupos_permissoes_usuarios',
    joinColumn: {
      name: 'grupo_permissao_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'usuario_login',
      referencedColumnName: 'login',
    },
  })
  usuarios: Usuario[];
}
