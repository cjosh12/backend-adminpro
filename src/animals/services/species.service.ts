import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Species } from '../entities';
import { Repository } from 'typeorm';
import { MyResponse } from 'src/core';
import { CreateSpeciesDto } from '../dto';

@Injectable()
export class SpeciesService {
    constructor(
        @InjectRepository(Species)
        private readonly speciesRepository: Repository<Species>
    ){}
    async create(
        createSpeciesDto: CreateSpeciesDto,
      ): Promise<MyResponse<Species>> {
        const { species_id, ...allData } = createSpeciesDto;
    
        const species = await this.speciesRepository.findOne({
          species_id,
        });
    
        if (species)
          throw new BadRequestException(`La especie ${name} ya existe`);
    
        try {
          const species = this.speciesRepository.create({
            name,
            ...allData,
          });
    
          await this.speciesRepository.save(species);
    
          const response: MyResponse<Species> = {
            statusCode: 201,
            status: 'Created',
            message: `La especie ${name} fue creada exitosamente`,
            reply: species,
          };
    
          return response;
        } catch (error) {
          console.log(error);
          this.handleDBErrors(error);
        }
      }
      
      getSpecies(species_id: string){
        
      }

      private handleDBErrors(error: any): never {
        throw new BadRequestException(`Error: ${error.detail}`);
      }
    }