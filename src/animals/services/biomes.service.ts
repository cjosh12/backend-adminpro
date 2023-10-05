import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Biome } from '../entities';
import { Repository } from 'typeorm';
import { CreateBiomeDto } from '../dto';
import { MyResponse, handleDBErrors } from 'src/core';

@Injectable()
export class BiomeService {
  constructor(
    @InjectRepository(Biome)
    private readonly biomeRepository: Repository<Biome>,
  ) {}

  async create(createBiomeDto: CreateBiomeDto): Promise<MyResponse<Biome>> {
    const { name, image_url } = createBiomeDto;

    const biomeVerification = await this.biomeRepository.findOne({
      where: { name },
    });

    if (biomeVerification)
      handleDBErrors(biomeVerification);

    try {
      const biome = this.biomeRepository.create({
        name,
        image_url,
      });

      await this.biomeRepository.save(biome);

      const response: MyResponse<Biome> = {
        statusCode: 201,
        status: 'Created',
        message: `El Bioma ${name} fue creada exitosamente`,
        reply: biome,
      };

      return response;
    } catch (error) {
      console.log(error);
      handleDBErrors(error);
    }
  }


}