import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { handleHttpError } from 'src/common/helpers/errors.helper';
import { YoutubeVideoData } from './entities/youtube-video-data.entity';
import { YoutubeVideoApiResponse } from './interfaces/youtube-video-api-response.interface';
import { YoutubeApiErrorReasonMessage } from './youtube-api-error-reason.enum';

@Injectable()
export class YoutubeService {
    private readonly youtubeApiKey: string;
    private readonly youtubeApiBaseUrl: string;
    private readonly partParams = 'snippet,contentDetails';

    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.youtubeApiKey =
            this.configService.getOrThrow<string>('YOUTUBE_API_KEY');
        this.youtubeApiBaseUrl = this.configService.getOrThrow<string>(
            'YOUTUBE_API_BASE_URL',
        );
    }

    async fetchVideoData(videoId: string): Promise<YoutubeVideoData> {
        const params = {
            id: videoId,
            part: this.partParams,
            key: this.youtubeApiKey,
        };

        try {
            const response = await firstValueFrom(
                this.http.get<YoutubeVideoApiResponse>(this.youtubeApiBaseUrl, { params }),
            );

            const data = response.data.items ? response.data.items[0] : undefined;
            if (!data) return handleHttpError(404, YoutubeApiErrorReasonMessage.VIDEO_NOT_FOUND);

            return {
                videoId,
                title: data.snippet.title,
                description: data.snippet.description,
                duration: data.contentDetails.duration,
            };
        } catch (error) {
            if (error instanceof AxiosError) return handleHttpError(error.response?.status ?? 500, error.response?.statusText);
            return handleHttpError(500)
        }
    }
}
