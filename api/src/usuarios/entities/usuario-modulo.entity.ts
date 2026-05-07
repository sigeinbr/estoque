import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ schema: 'adm', name: 'view_usuarios_modulos' })
export class UsuarioModulo {
  @PrimaryColumn()
  id: number;

  @Column()
  descricao: string;

  @Column({ select: false })
  ug_id: number;

  @Column({ select: false })
  usuario_login: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.modulos)
  @JoinColumn({ name: 'usuario_login' })
  usuario: Usuario;
}
