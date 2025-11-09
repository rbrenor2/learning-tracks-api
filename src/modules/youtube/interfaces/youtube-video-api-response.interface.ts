export interface YoutubeVideoApiResponse {
    items?: YoutubeVideoItemApiResponse[]
}

export interface YoutubeVideoItemApiResponse {
    id: string;
    snippet: {
        title: string;
        description: string;
    };
    contentDetails: {
        duration: string;
    }
}