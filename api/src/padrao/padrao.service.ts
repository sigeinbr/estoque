import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/_shared/models/record.model';
import { IsNull, Repository } from 'typeorm';
import { CreatePadraoDto } from './dto/create-padrao.dto';
import { UpdatePadraoDto } from './dto/update-padrao.dto';
import { Padrao } from './entities/padrao.entity';

@Injectable()
export class PadraoService {
  constructor(
    @InjectRepository(Padrao)
    private padraoRepository: Repository<Padrao>,
  ) {}

  async create(createPadraoDto: CreatePadraoDto, ugId: number, createdBy: string) {
    const padrao = new Padrao();
    padrao.created_by = createdBy;
    padrao.ug_id = ugId;
    padrao.campoInteiro = createPadraoDto.campoInteiro;
    padrao.campoTextoCurto = createPadraoDto.campoTextoCurto;
    padrao.campoTextoLongo = createPadraoDto.campoTextoLongo;
    padrao.campoData = createPadraoDto.campoData;
    padrao.campoDatahora = createPadraoDto.campoDatahora;
    padrao.campoBoolean = createPadraoDto.campoBoolean;
    padrao.campoNumeric = createPadraoDto.campoNumeric;
    padrao.campoArquivo = createPadraoDto.campoArquivo;
    padrao.campoJson = createPadraoDto.campoJson;

    await this.padraoRepository.save(padrao);

    return await this.padraoRepository.findOneBy({ id: padrao.id, ug_id: ugId });
  }

  async update(id: number, ugId: number, updatePadraoDto: UpdatePadraoDto, updatedBy: string) {
    await this.padraoRepository.update(
      { id, ug_id: ugId },
      { ...updatePadraoDto, updated_by: updatedBy },
    );

    return await this.padraoRepository.findOneBy({ id, ug_id: ugId });
  }

  async delete(id: number, ugId: number, deletedBy: string) {
    const result = await this.padraoRepository.update(
      { id, ug_id: ugId },
      { deleted_by: deletedBy },
    );

    return result.affected > 0;
  }

  async findAll(ugId: number) {
    const [data, total] = await this.padraoRepository.findAndCount({
      where: {
        ug_id: ugId,
        deleted_by: IsNull(),
      },
      order: {
        id: 'DESC',
      },
    });

    return new Record<Padrao>({ data, total });
  }
}
