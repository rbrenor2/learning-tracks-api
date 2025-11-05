import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { YoutubeVideoData } from './entities/youtube-video-data.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { YoutubeApiError } from './youtube-api-error.interface';
import { handleHttpError } from 'src/common/helpers/errors.helper';
import { YoutubeApiErrorReasonMessage } from './youtube-api-error-reason.enum';

@Injectable()
export class YoutubeService {
    private readonly youtubeApiKey: string;
    private readonly youtubeApiBaseUrl: string;
    private readonly partParams = "snippet,contentDetails"

    constructor(private readonly http: HttpService, private readonly configService: ConfigService) {
        this.youtubeApiKey = this.configService.getOrThrow<string>('YOUTUBE_API_KEY');
        this.youtubeApiBaseUrl = this.configService.getOrThrow<string>('YOUTUBE_API_BASE_URL');
    }

    async fetchVideoData(videoId: string): Promise<YoutubeVideoData> {
        const params = {
            id: videoId,
            part: this.partParams,
            key: this.youtubeApiKey
        }

        try {
            const response = await firstValueFrom(
                this.http.get(this.youtubeApiBaseUrl, { params })
            )

            const data = response.data.items[0]
            if (!data) {
                handleHttpError(404, YoutubeApiErrorReasonMessage.VIDEO_NOT_FOUND)
            }

            return {
                videoId,
                title: data.snippet.title,
                description: data.snippet.description,
                duration: data.contentDetails.duration
            }
        } catch (error) {
            return handleHttpError(error.response.statusCode, error.response.message)
        }
    }
}
