import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCoachingDto } from './dto/create-service.dto';
import { UpdateCoachingDto } from './dto/update-service.dto';
import { CoachingService } from './coaching.service';

@Controller('coaching')
@UseGuards(AuthGuard('jwt'))
export class CoachingController {
  constructor(private readonly coachingService: CoachingService) {}

  @Post()
  create(@Body() createCoachingDto: CreateCoachingDto) {
    return this.coachingService.create(createCoachingDto);
  }

  @Get()
  findAll() {
    return this.coachingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coachingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoachingDto: UpdateCoachingDto) {
    return this.coachingService.update(+id, updateCoachingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coachingService.remove(+id);
  }
}
