import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ContentTrack } from './content-track.entity';

@Entity('contents')
export class Content {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    url: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true, type: 'integer' })
    duration: number;

    @Column({ default: false })
    completed: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => ContentTrack, (contentTrack: ContentTrack) => contentTrack.content)
    contentTracks: ContentTrack[];
}
