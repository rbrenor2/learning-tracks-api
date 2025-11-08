import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TracksService } from './tracks.service';
import type { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) { }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('_q') q: string, @Query('pageSize') pageSize: number, @Query('pageNumber') pageNumber: number) {
    return this.tracksService.findAll({ q, pageSize, pageNumber });
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
