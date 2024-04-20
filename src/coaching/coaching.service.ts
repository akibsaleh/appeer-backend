/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateCoachingDto } from './dto/create-service.dto';
import { UpdateCoachingDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coaching } from './schema/coaching.schema';
import { Model } from 'mongoose';

@Injectable()
export class CoachingService {
  constructor(@InjectModel(Coaching.name) private coachingModel: Model<Coaching>){}

  async create(createCoachingDto: CreateCoachingDto): Promise<Coaching> {
    const createCoaching = new this.coachingModel(createCoachingDto);
    return createCoaching.save();
  }

  findAll() {
    return this.coachingModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateCoachingDto: UpdateCoachingDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
