import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

// Entities
import { ContentTrack } from '../modules/contents/entities/content-track.entity';
import { Content } from '../modules/contents/entities/content.entity';
import { Track } from '../modules/tracks/entities/track.entity';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class DatabaseSeederService {
    private readonly logger = new Logger(DatabaseSeederService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Track)
        private readonly trackRepository: Repository<Track>,
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
        @InjectRepository(ContentTrack)
        private readonly contentTrackRepository: Repository<ContentTrack>,
        private readonly dataSource: DataSource,
    ) { }

    async seed(): Promise<void> {
        this.logger.log('🌱 Starting database seeding...');

        try {
            // Check if data already exists
            const userCount = await this.userRepository.count();
            if (userCount > 0) {
                this.logger.log('📊 Database already contains data. Skipping seeding.');
                return;
            }

            await this.seedUsers();
            await this.seedTracks();
            await this.seedContents();
            await this.seedContentTracks();

            this.logger.log('✅ Database seeding completed successfully!');
        } catch (error) {
            this.logger.error('❌ Database seeding failed:', error);
            throw error;
        }
    }

    private async seedUsers(): Promise<User[]> {
        this.logger.log('👤 Seeding users...');

        const usersData = [
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123', // Will be hashed by entity hook
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                password: 'securepass456',
            },
            {
                name: 'Bob Wilson',
                email: 'bob.wilson@example.com',
                password: 'mypassword789',
            },
            {
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                password: 'strongpass321',
            },
        ];

        const users = this.userRepository.create(usersData);
        const savedUsers = await this.userRepository.save(users);

        this.logger.log(`✅ Created ${savedUsers.length} users`);
        return savedUsers;
    }

    private async seedTracks(): Promise<Track[]> {
        this.logger.log('🛤️  Seeding tracks...');

        const tracksData = [
            { name: 'JavaScript Fundamentals' },
            { name: 'React Basics' },
            { name: 'Advanced React' },
            { name: 'Node.js Development' },
            { name: 'Express Framework' },
            { name: 'Database Design' },
            { name: 'TypeScript Essentials' },
            { name: 'API Development' },
            { name: 'Frontend Development' },
            { name: 'Backend Development' },
            { name: 'Full Stack Development' },
            { name: 'Web Development' },
            { name: 'Mobile Development' },
            { name: 'DevOps Basics' },
            { name: 'Testing Strategies' },
            { name: 'Code Quality' },
            { name: 'Performance Optimization' },
            { name: 'Security Best Practices' },
        ];

        const tracks = this.trackRepository.create(tracksData);
        const savedTracks = await this.trackRepository.save(tracks);

        this.logger.log(`✅ Created ${savedTracks.length} tracks`);
        return savedTracks;
    }

    private async seedContents(): Promise<Content[]> {
        this.logger.log('📹 Seeding contents...');

        const contentsData = [
            {
                videoId: 'dQw4w9WgXcQ',
                title: 'JavaScript ES6 Features Explained',
                description: 'A comprehensive guide to modern JavaScript features including arrow functions, destructuring, and modules.',
                duration: 1800, // 30 minutes
                completed: false,
            },
            {
                videoId: 'jNQXAC9IVRw',
                title: 'React Hooks Deep Dive',
                description: 'Learn about useState, useEffect, and custom hooks with practical examples.',
                duration: 2400, // 40 minutes
                completed: true,
            },
            {
                videoId: 'kJlUGJ5GENI',
                title: 'Node.js and Express Tutorial',
                description: 'Build a RESTful API from scratch using Node.js and Express framework.',
                duration: 3600, // 60 minutes
                completed: false,
            },
            {
                videoId: 'fBNz5xF-Kx4',
                title: 'TypeScript for Beginners',
                description: 'Introduction to TypeScript: types, interfaces, and advanced features.',
                duration: 2700, // 45 minutes
                completed: false,
            },
            {
                videoId: 'y8Yv4pnO7qc',
                title: 'Database Design Principles',
                description: 'Learn about normalization, relationships, and efficient database design.',
                duration: 2100, // 35 minutes
                completed: true,
            },
            {
                videoId: 'TlB_eWDSMt4',
                title: 'Advanced React Patterns',
                description: 'Higher-order components, render props, and compound components explained.',
                duration: 3300, // 55 minutes
                completed: false,
            },
            {
                videoId: '8xoTNLmtQdc',
                title: 'API Design Best Practices',
                description: 'RESTful principles, versioning, authentication, and documentation.',
                duration: 2850, // 47.5 minutes
                completed: false,
            },
            {
                videoId: 'Oe421EPjeBE',
                title: 'Frontend Performance Optimization',
                description: 'Techniques to improve loading times and user experience.',
                duration: 2550, // 42.5 minutes
                completed: true,
            },
            {
                videoId: 'zg9ih6SVACc',
                title: 'Testing JavaScript Applications',
                description: 'Unit testing, integration testing, and E2E testing strategies.',
                duration: 3900, // 65 minutes
                completed: false,
            },
            {
                videoId: 'bc4nRF5to_I',
                title: 'DevOps for Developers',
                description: 'CI/CD, containerization, and deployment strategies.',
                duration: 4200, // 70 minutes
                completed: false,
            },
        ];

        const contents = this.contentRepository.create(contentsData);
        const savedContents = await this.contentRepository.save(contents);

        this.logger.log(`✅ Created ${savedContents.length} contents`);
        return savedContents;
    }

    private async seedContentTracks(): Promise<void> {
        this.logger.log('🔗 Seeding content-track relationships...');

        // Get all contents and tracks
        const contents = await this.contentRepository.find();
        const tracks = await this.trackRepository.find();

        // Create a mapping of content titles to track names
        const contentTrackMappings = [
            {
                contentTitle: 'JavaScript ES6 Features Explained',
                trackNames: ['JavaScript Fundamentals', 'Web Development', 'Frontend Development']
            },
            {
                contentTitle: 'React Hooks Deep Dive',
                trackNames: ['React Basics', 'Frontend Development', 'Web Development']
            },
            {
                contentTitle: 'Node.js and Express Tutorial',
                trackNames: ['Node.js Development', 'Express Framework', 'Backend Development', 'API Development']
            },
            {
                contentTitle: 'TypeScript for Beginners',
                trackNames: ['TypeScript Essentials', 'JavaScript Fundamentals', 'Web Development']
            },
            {
                contentTitle: 'Database Design Principles',
                trackNames: ['Database Design', 'Backend Development', 'API Development']
            },
            {
                contentTitle: 'Advanced React Patterns',
                trackNames: ['Advanced React', 'React Basics', 'Frontend Development']
            },
            {
                contentTitle: 'API Design Best Practices',
                trackNames: ['API Development', 'Backend Development', 'Web Development']
            },
            {
                contentTitle: 'Frontend Performance Optimization',
                trackNames: ['Performance Optimization', 'Frontend Development', 'Web Development']
            },
            {
                contentTitle: 'Testing JavaScript Applications',
                trackNames: ['Testing Strategies', 'Code Quality', 'JavaScript Fundamentals']
            },
            {
                contentTitle: 'DevOps for Developers',
                trackNames: ['DevOps Basics', 'Backend Development', 'Full Stack Development']
            },
        ];

        const contentTrackRelations: Array<{
            idContent: number;
            idTrack: number;
            position: number;
        }> = [];

        for (const mapping of contentTrackMappings) {
            const content = contents.find(c => c.title === mapping.contentTitle);
            if (!content) continue;

            for (const trackName of mapping.trackNames) {
                const track = tracks.find(t => t.name === trackName);
                if (!track) continue;

                contentTrackRelations.push({
                    idContent: content.id,
                    idTrack: track.id,
                    position: mapping.trackNames.indexOf(trackName) + 1,
                });
            }
        }

        const savedRelations = await this.contentTrackRepository.save(contentTrackRelations);
        this.logger.log(`✅ Created ${savedRelations.length} content-track relationships`);
    }

    async clear(): Promise<void> {
        this.logger.log('🧹 Clearing all seeded data...');

        try {
            // Use raw SQL to handle foreign key constraints properly
            await this.dataSource.query('TRUNCATE TABLE "contents_tracks" RESTART IDENTITY CASCADE');
            await this.dataSource.query('TRUNCATE TABLE "contents" RESTART IDENTITY CASCADE');
            await this.dataSource.query('TRUNCATE TABLE "tracks" RESTART IDENTITY CASCADE');
            await this.dataSource.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');

            this.logger.log('✅ Database cleared successfully!');
        } catch (error) {
            this.logger.error('❌ Database clearing failed:', error);
            throw error;
        }
    }
}