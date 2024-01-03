// exchange.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from './entity/exchange-rate.entity';
import { ExchangeDto } from './dto/exchange.dto';
import { ApiException } from 'src/exceptions/api-exception';
import { ExchangeResponseDto } from './dto/exchange-response.dto';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
  ) {}

  async calculateExchangeRate(
    exchangeDto: ExchangeDto,
  ): Promise<ExchangeResponseDto> {
    const { amount, sourceCurrency, targetCurrency } = exchangeDto;
    const exchangeRate: Partial<ExchangeResponseDto> =
      await this.exchangeRateRepository.findOne({
        where: { sourceCurrency, targetCurrency },
      });

    if (!exchangeRate) {
      throw new ApiException(
        '[ExchangeService.calculateExchangeRate] : Tipo de cambio no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const convertedAmount = amount * exchangeRate.rate;
    return {
      amount,
      convertedAmount,
      sourceCurrency,
      targetCurrency,
      rate: exchangeRate.rate,
    };
  }

  async createExchangeRate(
    exchangeDto: ExchangeDto,
  ): Promise<ExchangeRate | string> {
    const { sourceCurrency, targetCurrency, rate } = exchangeDto;

    let exchangeRate = await this.exchangeRateRepository.findOne({
      where: { sourceCurrency, targetCurrency },
    });

    if (exchangeRate) {
      if (exchangeRate.rate === rate) {
        throw new ApiException(
          '[ExchangeService.createExchangeRate] : El tipo de cambio ya tiene el mismo valor de tasa.',
          HttpStatus.CONFLICT,
        );
      }
      exchangeRate.rate = rate;
    } else {
      exchangeRate = this.exchangeRateRepository.create({
        sourceCurrency,
        targetCurrency,
        rate,
      });
    }

    return this.exchangeRateRepository.save(exchangeRate);
  }

  async seedExchangeRates() {
    const existingRates = await this.exchangeRateRepository.find();
    if (existingRates.length === 0) {
      const rates = [
        { sourceCurrency: 'USD', targetCurrency: 'EUR', rate: 0.85 },
        { sourceCurrency: 'EUR', targetCurrency: 'USD', rate: 1.18 },
        { sourceCurrency: 'GBP', targetCurrency: 'USD', rate: 1.38 },
        { sourceCurrency: 'USD', targetCurrency: 'JPY', rate: 110.25 },
        { sourceCurrency: 'CAD', targetCurrency: 'USD', rate: 0.8 },
        { sourceCurrency: 'AUD', targetCurrency: 'USD', rate: 0.75 },
        { sourceCurrency: 'USD', targetCurrency: 'CHF', rate: 0.92 },
        { sourceCurrency: 'USD', targetCurrency: 'CNY', rate: 6.45 },
        { sourceCurrency: 'JPY', targetCurrency: 'EUR', rate: 0.0077 },
        { sourceCurrency: 'EUR', targetCurrency: 'GBP', rate: 0.86 },
      ];

      rates.forEach(async (rate) => {
        const exchangeRate = this.exchangeRateRepository.create(rate);
        await this.exchangeRateRepository.save(exchangeRate);
      });
    }
  }
}
