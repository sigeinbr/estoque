import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UgModulo } from './entities/ug-modulo.entity';
import { Ug } from './entities/ug.entity';
import { UgsController } from './ugs.controller';
import { UgsService } from './ugs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ug, UgModulo])],
  controllers: [UgsController],
  providers: [UgsService],
})
export class UgsModule {}
