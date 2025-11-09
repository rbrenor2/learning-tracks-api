/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { ContentsModule } from '../src/modules/contents/contents.module';
import { CreateContentDto } from '../src/modules/contents/dto/create-content.dto';
import { ContentTrack } from '../src/modules/contents/entities/content-track.entity';
import { Content } from '../src/modules/contents/entities/content.entity';
import { Track } from '../src/modules/tracks/entities/track.entity';
import { TracksModule } from '../src/modules/tracks/tracks.module';
import { YoutubeVideoData } from '../src/modules/youtube/entities/youtube-video-data.entity';
import { YoutubeService } from '../src/modules/youtube/youtube.service';

describe('Contents Integration Tests (e2e)', () => {
    let app: INestApplication;
    let contentRepository: Repository<Content>;
    let trackRepository: Repository<Track>;
    let contentTrackRepository: Repository<ContentTrack>;

    const mockYouTubeVideoData: YoutubeVideoData = {
        videoId: 'test-video-id',
        title: 'Test Video Title',
        description: 'Test video description',
        duration: 'PT10M30S'
    };

    const mockYouTubeService = {
        fetchVideoData: jest.fn().mockImplementation((videoId: string) => {
            return Promise.resolve({
                ...mockYouTubeVideoData,
                videoId
            });
        })
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                // Use in-memory SQLite for testing
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [Content, Track, ContentTrack],
                    synchronize: true,
                    logging: false,
                }),
                ContentsModule,
                TracksModule,
            ],
        })
            .overrideProvider(YoutubeService)
            .useValue(mockYouTubeService)
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();

        contentRepository = app.get(getRepositoryToken(Content));
        trackRepository = app.get(getRepositoryToken(Track));
        contentTrackRepository = app.get(getRepositoryToken(ContentTrack));
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        // Clear all data before each test
        await contentTrackRepository.clear();
        await contentRepository.clear();
        await trackRepository.clear();
    });

    describe('/contents (POST) - Create content with tracks', () => {
        it('should create content with new tracks successfully', async () => {
            const createContentDto: CreateContentDto = {
                videoId: 'test-video-id',
                tracks: ['JavaScript Basics', 'Web Development', 'Programming']
            };

            const response = await request(app.getHttpServer())
                .post('/contents')
                .send(createContentDto)
                .expect(201);

            // Verify the response
            expect(response.body).toMatchObject({
                id: expect.any(Number),
                videoId: mockYouTubeVideoData.videoId,
                title: mockYouTubeVideoData.title,
                description: mockYouTubeVideoData.description,
                duration: 630,
                completed: false,
                createdAt: expect.any(String)
            });

            // Verify content was created in database
            const contentInDb = await contentRepository.findOne({
                where: { id: response.body.id }
            });
            expect(contentInDb).toBeTruthy();
            expect(contentInDb!.videoId).toBe(createContentDto.videoId);

            // Verify tracks were created
            const tracksInDb = await trackRepository.find();
            expect(tracksInDb).toHaveLength(3);
            expect(tracksInDb.map(track => track.name)).toEqual(
                expect.arrayContaining(['JavaScript Basics', 'Web Development', 'Programming'])
            );

            // Verify content-track relationships were created
            const contentTracksInDb = await contentTrackRepository.find({
                where: { idContent: response.body.id }
            });
            expect(contentTracksInDb).toHaveLength(3);

            // Verify YouTube service was called
            expect(mockYouTubeService.fetchVideoData).toHaveBeenCalledWith('test-video-id');
        });

        it('should create content without tracks successfully', async () => {
            const createContentDto: CreateContentDto = {
                videoId: 'test-video-no-tracks'
            };

            const response = await request(app.getHttpServer())
                .post('/contents')
                .send(createContentDto)
                .expect(201);

            // Verify the response
            expect(response.body).toMatchObject({
                id: expect.any(Number),
                videoId: 'test-video-no-tracks',
                title: mockYouTubeVideoData.title,
                description: mockYouTubeVideoData.description,
                duration: 630,
                completed: false
            });

            // Verify no tracks were created
            const tracksInDb = await trackRepository.find();
            expect(tracksInDb).toHaveLength(0);

            // Verify no content-track relationships were created
            const contentTracksInDb = await contentTrackRepository.find();
            expect(contentTracksInDb).toHaveLength(0);
        });

        it('should reuse existing tracks when creating content', async () => {
            const existingTrack1 = trackRepository.create({ name: 'JavaScript Basics' });
            const existingTrack2 = trackRepository.create({ name: 'Advanced React' });
            await trackRepository.save([existingTrack1, existingTrack2]);

            const createContentDto: CreateContentDto = {
                videoId: 'test-reuse-tracks',
                tracks: ['JavaScript Basics', 'New Track', 'Advanced React'] // Mix of existing and new
            };

            const response = await request(app.getHttpServer())
                .post('/contents')
                .send(createContentDto)
                .expect(201);

            // Verify content was created
            expect(response.body.id).toBeDefined();

            // Verify tracks count (should still be 3 total: 2 existing + 1 new)
            const tracksInDb = await trackRepository.find();
            expect(tracksInDb).toHaveLength(3);
            expect(tracksInDb.map(track => track.name)).toEqual(
                expect.arrayContaining(['JavaScript Basics', 'Advanced React', 'New Track'])
            );

            // Verify content-track relationships
            const contentTracksInDb = await contentTrackRepository.find({
                where: { idContent: response.body.id }
            });
            expect(contentTracksInDb).toHaveLength(3);
        });

        it('should handle validation errors correctly', async () => {
            const invalidDto = {
                videoId: '', // Empty video ID should fail validation
                tracks: ['Valid Track', 'Track@Invalid'] // Contains special characters
            };

            const response = await request(app.getHttpServer())
                .post('/contents')
                .send(invalidDto)
                .expect(400);

            // Verify validation error response
            expect(response.body.message).toContain('Video ID is required');
            expect(response.body.message).toContain('Track contains unallowed characters');

            // Verify nothing was created in database
            const contentsInDb = await contentRepository.find();
            const tracksInDb = await trackRepository.find();
            expect(contentsInDb).toHaveLength(0);
            expect(tracksInDb).toHaveLength(0);
        });

        it('should reject content creation when tracks contain special characters and create nothing in database', async () => {
            const invalidDto = {
                videoId: 'valid-video-id',
                tracks: [
                    'JavaScript Basics',
                    'React@Advanced',
                    'Node Development',
                    'Vue#Framework',
                    'Angular Tutorial'
                ]
            };

            const response = await request(app.getHttpServer())
                .post('/contents')
                .send(invalidDto)
                .expect(400);

            expect(response.body.message).toContain('Track contains unallowed characters');
            expect(response.body.statusCode).toBe(400);

            // Verify absolutely nothing was created in database
            const contentsInDb = await contentRepository.find();
            const tracksInDb = await trackRepository.find();
            const contentTracksInDb = await contentTrackRepository.find();

            expect(contentsInDb).toHaveLength(0);
            expect(tracksInDb).toHaveLength(0);
            expect(contentTracksInDb).toHaveLength(0);

            // Verify YouTube service was NOT called since validation failed before that
            expect(mockYouTubeService.fetchVideoData).not.toHaveBeenCalledWith('valid-video-id');
        });

        it('should handle YouTube service errors', async () => {
            // Mock YouTube service to throw an error
            mockYouTubeService.fetchVideoData.mockRejectedValueOnce(
                new Error('Video not found')
            );

            const createContentDto: CreateContentDto = {
                videoId: 'invalid-video-id',
                tracks: ['Test Track']
            };

            await request(app.getHttpServer())
                .post('/contents')
                .send(createContentDto)
                .expect(500); // Should handle the error

            // Verify nothing was created in database
            const contentsInDb = await contentRepository.find();
            const tracksInDb = await trackRepository.find();
            expect(contentsInDb).toHaveLength(0);
            expect(tracksInDb).toHaveLength(0);

            // Reset mock for other tests
            mockYouTubeService.fetchVideoData.mockResolvedValue(mockYouTubeVideoData);
        });

        it('should handle duplicate video IDs correctly', async () => {
            // First content creation
            const firstContentDto: CreateContentDto = {
                videoId: 'duplicate-video-id',
                tracks: ['Track 1']
            };

            await request(app.getHttpServer())
                .post('/contents')
                .send(firstContentDto)
                .expect(201);

            // Try to create content with same video ID
            const secondContentDto: CreateContentDto = {
                videoId: 'duplicate-video-id', // Same video ID
                tracks: ['Track 2']
            };

            await request(app.getHttpServer())
                .post('/contents')
                .send(secondContentDto)
                .expect(409); // Conflict due to unique constraint

            // Verify only one content exists
            const contentsInDb = await contentRepository.find();
            expect(contentsInDb).toHaveLength(1);

            // Verify only first track was created
            const tracksInDb = await trackRepository.find();
            expect(tracksInDb).toHaveLength(1);
            expect(tracksInDb[0].name).toBe('Track 1');
        });
    });

    describe('Database cleanup verification', () => {
        it('should properly clean up data between tests', async () => {
            // This test verifies that our beforeEach cleanup works
            const contentsInDb = await contentRepository.find();
            const tracksInDb = await trackRepository.find();
            const contentTracksInDb = await contentTrackRepository.find();

            expect(contentsInDb).toHaveLength(0);
            expect(tracksInDb).toHaveLength(0);
            expect(contentTracksInDb).toHaveLength(0);
        });
    });
});