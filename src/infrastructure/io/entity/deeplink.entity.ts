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

  @Column('timestamp', {
    name: 'expires_at',
    nullable: true,
  })
  expiresAt?: Date;

  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
