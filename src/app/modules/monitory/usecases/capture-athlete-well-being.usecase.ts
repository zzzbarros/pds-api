import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase, TokenTypeEnum } from 'src/app/shared';
import { CaptureAthleteWellBeingDto } from '../dtos';
import { CaptureWellBeing } from '../entities';
import type {
  IWellBeingRepository,
  IMonitoryTokenRepository,
} from '../repositories';

@Injectable()
export class CaptureAthleteWellBeingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IWellBeingRepository')
    private readonly wellBeingRepository: IWellBeingRepository,
    @Inject('IMonitoryTokenRepository')
    private readonly tokenRepository: IMonitoryTokenRepository,
  ) {}

  async execute({ token, ...captureData }: CaptureAthleteWellBeingDto) {
    const findToken = await this.tokenRepository.findByToken(token);

    if (!findToken)
      throw new BadRequestException({
        title: 'Token não encontrado.',
        message: 'Verifique e tente novamente...',
      });

    const today = new Date();
    const validateDate = today < findToken.getExpiresIn();

    if (!validateDate || !findToken.getIsValid())
      throw new BadRequestException({
        title: 'Token inválido.',
        message: 'Verifique e tente novamente...',
      });

    const capture = new CaptureWellBeing({
      ...captureData,
      athleteId: findToken.getUserId(),
      date: findToken.getCreatedAt(),
    });

    await this.wellBeingRepository.capture(capture);

    findToken.invalid();
    await this.tokenRepository.update(findToken);

    return {
      title: 'Acompanhamento de Bem-estar recebido com sucesso!',
      message:
        'As informações já foram entregues ao seu treinador e serão muito importantes para o planejamento dos próximos treinos.',
    };
  }
}
