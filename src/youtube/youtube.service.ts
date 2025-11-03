import { Injectable } from '@nestjs/common';
import { YoutubeVideoData } from './entities/youtube-video-data.entity';

@Injectable()
export class YoutubeService {
    async fetchVideoData(url: string): Promise<YoutubeVideoData> {
        return {
            title: "Basics of Typescript",
            description: "Short description",
            duration: 12000
        }
    }
}
