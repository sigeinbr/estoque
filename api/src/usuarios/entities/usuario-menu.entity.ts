import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'adm', name: 'view_usuarios_menus' })
export class UsuarioMenu {
  @PrimaryColumn()
  id: number;

  @Column()
  rota: string;

  @Column({ select: false })
  usuario_login: number;

  @Column({ select: false })
  modulo_id: number;

  @Column({ select: false })
  ug_id: number;
}
