import { Modulo } from 'src/modulos/entities/modulos.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'audit', name: 'view_log_acessos_detalhada' })
export class LogAcessoDetalhada {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_login: string;

  @Column({ type: 'timestamp' })
  dh_acesso: Date;

  @Column()
  modulo_id: number;

  @ManyToOne(() => Modulo)
  @JoinColumn({ name: 'modulo_id' })
  modulo: Modulo;

  @Column()
  rota: string;

  @Column()
  ip: string;

  @Column({ type: 'jsonb' })
  context: any;

  @Column()
  user_agent: string;

  @Column()
  browser: string;

  @Column()
  os: string;
}
