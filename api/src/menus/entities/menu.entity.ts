import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'adm', name: 'menus' })
export class Menu {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  modulo_id: number;

  @Column()
  menu_pai_id: string;

  @Column()
  ordem: number;

  @Column()
  descricao: string;

  @Column()
  rota: string;

  @Column()
  icon: string;
}
