import { BadRequestException, Injectable } from '@nestjs/common';
import { YoutubeVideoData } from './entities/youtube-video-data.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YoutubeService {
    private readonly youtubeApiKey: string;
    private readonly youtubeApiBaseUrl: string;

    constructor(private readonly http: HttpService, private readonly configService: ConfigService) {
        this.youtubeApiKey = this.configService.getOrThrow<string>('YOUTUBE_API_KEY');
        this.youtubeApiBaseUrl = this.configService.getOrThrow<string>('YOUTUBE_API_BASE_URL');
    }

    async fetchVideoData(videoId: string): Promise<YoutubeVideoData> {
        const params = {
            id: videoId,
            part: "snippet,contentDetails",
            key: this.youtubeApiKey
        }

        const response = await firstValueFrom(
            this.http.get(this.youtubeApiBaseUrl, { params })
        )

        const data = response.data?.items[0]
        if (!data) {
            throw new BadRequestException("Video not found")
        }

        return {
            videoId,
            title: data.snippet.title,
            description: data.snippet.description,
            duration: data.contentDetails.duration
        }
    }
}
