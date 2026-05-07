import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ schema: 'adm', name: 'view_usuarios_ugs' })
export class UsuarioUg {
  @PrimaryColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ select: false })
  modulo_id: string;

  @Column({ select: false })
  usuario_login: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.ugs)
  @JoinColumn({ name: 'usuario_login' })
  usuario: Usuario;
}
