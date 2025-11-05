import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, PrimaryColumn } from 'typeorm';
import { Content } from './content.entity';
import { Track } from '../../tracks/entities/track.entity';

@Entity('contents_tracks')
@Index(['idContent', 'idTrack'], { unique: true })
@Index(['idTrack', 'position'])
export class ContentTrack {
    @PrimaryColumn({ name: 'id_content' })
    idContent: number;

    @PrimaryColumn({ name: 'id_track' })
    idTrack: number;

    @Column({ nullable: true })
    position: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Content, content => content.contentTracks)
    @JoinColumn({ name: 'id_content' })
    content: Content;

    @ManyToOne(() => Track, track => track.contentTracks)
    @JoinColumn({ name: 'id_track' })
    track: Track;
}