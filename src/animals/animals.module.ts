import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimalsService, BiomeService, DietService, SpeciesService } from './services';
import { AnimalsController, DietController, SpeciesController } from './controllers';
import { Animal, Biome, Diet, MedicalRecord, Species } from './entities';
import { BiomeController } from './controllers/biome.controller';
import { Auth, AuthModule } from 'src/auth';



@Module({
  imports: [TypeOrmModule.forFeature([Animal, Species, Biome, MedicalRecord, Diet]),
            AuthModule,            
],
  controllers: [
    AnimalsController,
    SpeciesController,
    BiomeController,
    DietController,
  ],
  providers: [AnimalsService, SpeciesService, BiomeService, DietService],
})
export class AnimalsModule {}
