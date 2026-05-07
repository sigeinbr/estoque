import { Controller, Get, Param } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Result, Type } from 'src/_shared/models/result.model';
import { MoreThanOrEqual } from 'typeorm';
import { Public } from '../_shared/decorators/public.decorator';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const token = await this.tokensService.findOneBy({
      id: id,
      validade: MoreThanOrEqual(DateTime.now()),
      ativo: true,
    });

    return new Result(Type.Success, 'Token validado com sucesso!', token);
  }
}
