import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimalsService, BiomeService, SpeciesService } from './services';
import { AnimalsController, SpeciesController } from './controllers';
import { Animal, Biome, MedicalRecord, Species } from './entities';
import { BiomeController } from './controllers/biome.controller';
import { DietService } from './services/diet.service';
import { DietController } from './controllers/diet.controller';



@Module({
  imports: [TypeOrmModule.forFeature([Animal, Species, Biome, MedicalRecord])],
  controllers: [
    AnimalsController,
    SpeciesController,
    BiomeController,
    DietController,
  ],
  providers: [AnimalsService, SpeciesService, BiomeService, DietService],
})
export class AnimalsModule {}
