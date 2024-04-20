import { Module } from '@nestjs/common';
import { CoachingService } from './coaching.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coaching, CoachingSchema } from './schema/coaching.schema';
import { CoachingController } from './coaching.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Coaching.name, schema: CoachingSchema}])],
  controllers: [CoachingController],
  providers: [CoachingService],
  exports: [CoachingService]
})
export class CoachingModule {}
