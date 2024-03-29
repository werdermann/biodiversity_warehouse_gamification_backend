import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Species } from './species.enum';
import { EvidenceStatus } from './evidence-status.enum';
import { Type } from 'class-transformer';
import { ReportMethod } from './report-method.enum';

/**
 * Data transfer object for creating a sighting.
 */
export class CreateSightingDto {
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  locationComment: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateSpeciesEntryDto)
  speciesEntries: CreateSpeciesEntryDto[];

  @IsDateString()
  date: string;

  @IsEnum(ReportMethod)
  reportMethod: ReportMethod;

  @IsString()
  detailsComment: string;
}

class CreateSpeciesEntryDto {
  @IsString()
  comment;

  @IsNumber()
  count: number;

  @IsEnum(Species)
  species: Species;

  @IsEnum(EvidenceStatus)
  evidenceStatus: EvidenceStatus;
}
