import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'audit', name: 'log_acessos' })
export class LogAcesso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_login: string;

  @Column({ type: 'timestamp' })
  dh_acesso: Date;

  @Column()
  modulo_id: number;

  @Column()
  rota: string;

  @Column()
  ip: string;

  @Column({ type: 'jsonb' })
  context: any;

  @Column()
  user_agent: string;
}
