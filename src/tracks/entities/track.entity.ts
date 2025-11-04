import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ContentTrack } from '../../contents/entities/content-track.entity';

@Entity('tracks')
export class Track {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => ContentTrack, (contentTrack: ContentTrack) => contentTrack.track)
    contentTracks: ContentTrack[];
}
