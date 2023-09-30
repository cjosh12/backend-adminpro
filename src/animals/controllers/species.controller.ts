import { Controller, 
    Get, 
    Param, 
    ParseUUIDPipe,
     Body,  
     Post  
    } from '@nestjs/common';

import { SpeciesService } from '../services';

import { MyResponse } from 'src/core';
import { Species } from '../entities';
import { CreateSpeciesDto } from '../dto';

@Controller('species')
export class SpeciesController {
    constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  create(
    @Body() createSpeciesDto: CreateSpeciesDto,
  ): Promise<MyResponse<Species>> {
    return this.speciesService.create(createSpeciesDto);
  }
  
  @Get(':species_id')
  getSpecies(
    @Param('species_id', ParseUUIDPipe) species_id: string,
  ): Promise<MyResponse<Species>> {
    return this.speciesService.getSpecies(species_id);
  }
}