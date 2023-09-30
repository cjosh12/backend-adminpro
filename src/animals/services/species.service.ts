import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        const { name, ...allData } = createSpeciesDto;
    
        const species = await this.speciesRepository.findOne({
          where: {name},
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
      
      async getSpecies(species_id: string): Promise<MyResponse<Species>>{
        const species = await this.speciesRepository.findOne({
            where: { species_id },
            relations: ['animals'],
        });

        if (!species)
        throw new NotFoundException(`La especie #${species_id} no existe`);
  
      const response: MyResponse<Species> = {
        statusCode: 200,
        status: 'OK',
        message: `La especie #${species_id} fue encontrada exitosamente`,
        reply: species,
      };
  
      return response;
    }
      

      private handleDBErrors(error: any): never {
        throw new BadRequestException(`Error: ${error.detail}`);
      }
    }