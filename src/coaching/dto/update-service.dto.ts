import { PartialType } from '@nestjs/mapped-types';

import { IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateCoachingDto } from './create-service.dto';

export class UpdateCoachingDto extends PartialType(CreateCoachingDto) {
    @IsOptional()
    @IsString()
    name?: string;

    @IsUrl()
    image: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    pricing?: string;
}
