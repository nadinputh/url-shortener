import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'deeplinks' })
export class Deeplink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, update: false })
  slug: string;

  @Column({ update: false })
  url: string;

  @Column({ default: 0 })
  clicks: number;

  @CreateDateColumn({ update: false })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
