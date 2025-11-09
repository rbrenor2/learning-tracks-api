#!/usr/bin/env node

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DatabaseSeederModule } from '../database/database-seeder.module';
import { DatabaseSeederService } from '../database/database-seeder.service';

async function bootstrap() {
    const logger = new Logger('DatabaseSeeder');

    try {
        logger.log('🚀 Starting database seeding application...');

        const app = await NestFactory.createApplicationContext(DatabaseSeederModule, {
            logger: ['log', 'error', 'warn'],
        });

        const seederService = app.get(DatabaseSeederService);

        // Parse command line arguments
        const args = process.argv.slice(2);
        const command = args[0];

        switch (command) {
            case 'seed':
                logger.log('📦 Running database seeding...');
                await seederService.seed();
                break;

            case 'clear':
                logger.log('🧹 Clearing database...');
                await seederService.clear();
                break;

            case 'reset':
                logger.log('🔄 Resetting database (clear + seed)...');
                await seederService.clear();
                await seederService.seed();
                break;

            default:
                logger.error('❌ Invalid command. Available commands: seed, clear, reset');
                logger.log('Usage examples:');
                logger.log('  npm run seed            # Seed the database');
                logger.log('  npm run seed:clear      # Clear all data');
                logger.log('  npm run seed:reset      # Clear and re-seed');
                process.exit(1);
        }

        logger.log('🎉 Operation completed successfully!');
        await app.close();
        process.exit(0);

    } catch (error) {
        logger.error('💥 Seeding operation failed:', error);
        process.exit(1);
    }
}

void bootstrap();