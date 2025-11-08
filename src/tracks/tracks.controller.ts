import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TracksService } from './tracks.service';
import type { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) { }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll(@Query('_q') _q?: string, @Query('_pageSize') _pageSize?: number, @Query('_pageNumber') _pageNumber?: number) {
    return this.tracksService.findAll({ _q, _pageSize, _pageNumber });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(+id, updateTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tracksService.remove(+id);
  }
}
