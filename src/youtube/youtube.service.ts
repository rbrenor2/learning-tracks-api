import { BadRequestException, Injectable } from '@nestjs/common';
import { YoutubeVideoData } from './entities/youtube-video-data.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YoutubeService {
    youtubeApiKey = process.env.YOUTUBE_API_KEY
    youtubeApiBaseUrl = process.env.YOUTUBE_API_BASE_URL

    constructor(private readonly http: HttpService) { }

    async fetchVideoData(videoId: string): Promise<YoutubeVideoData> {
        const parametersPart = "snippet,contentDetails"
        const url = `${this.youtubeApiBaseUrl}?id=${videoId}&part=${parametersPart}&key=${this.youtubeApiKey}`
        const response = await firstValueFrom(
            this.http.get(url)
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
