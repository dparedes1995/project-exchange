import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from './exchange.service';
import { Repository } from 'typeorm';
import { ExchangeRate } from './entity/exchange-rate.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeDto } from './dto/exchange.dto';
import { ApiException } from 'src/exceptions/api-exception';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let repository: Repository<ExchangeRate>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        {
          provide: getRepositoryToken(ExchangeRate),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    repository = module.get<Repository<ExchangeRate>>(
      getRepositoryToken(ExchangeRate),
    );
  });

  describe('calculateExchangeRate', () => {
    it('should calculate the exchange rate correctly', async () => {
      const exchangeDto: ExchangeDto = {
        amount: 100,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
      };
      const exchangeRate: ExchangeRate = {
        id: 1,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(exchangeRate);

      const result = await service.calculateExchangeRate(exchangeDto);

      expect(result).toEqual({
        amount: 100,
        convertedAmount: 85,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      });
    });

    it('should throw an ApiException when the exchange rate is not found', async () => {
      const exchangeDto: ExchangeDto = {
        amount: 100,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.calculateExchangeRate(exchangeDto)).rejects.toThrow(
        ApiException,
      );
    });
  });
  describe('createExchangeRate', () => {
    it('should update the exchange rate if it already exists and the rate is different', async () => {
      const exchangeDto: ExchangeDto = {
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      const existingExchangeRate: ExchangeRate = {
        id: 1,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.9,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingExchangeRate);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...existingExchangeRate, rate: exchangeDto.rate });

      const result = await service.createExchangeRate(exchangeDto);

      expect(result).toEqual({
        ...existingExchangeRate,
        rate: exchangeDto.rate,
      });
    });

    it('should throw an ApiException if the exchange rate already exists and the rate is the same', async () => {
      const exchangeDto: ExchangeDto = {
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      const existingExchangeRate: ExchangeRate = {
        id: 1,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingExchangeRate);

      await expect(service.createExchangeRate(exchangeDto)).rejects.toThrow(
        ApiException,
      );
    });

    it('should create a new exchange rate if it does not exist', async () => {
      const exchangeDto: ExchangeDto = {
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        rate: 0.85,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      jest
        .spyOn(repository, 'create')
        .mockReturnValue(exchangeDto as ExchangeRate);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(exchangeDto as ExchangeRate);

      const result = await service.createExchangeRate(exchangeDto);

      expect(result).toEqual(exchangeDto);
    });
  });
  describe('seedExchangeRates', () => {
    it('should seed the exchange rates when there are no existing rates', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      jest
        .spyOn(repository, 'create')
        .mockImplementation((entity) => entity as ExchangeRate);
      const saveSpy = jest.spyOn(repository, 'save');

      await service.seedExchangeRates();

      expect(saveSpy).toHaveBeenCalledTimes(10);
    });

    it('should not seed the exchange rates when there are existing rates', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([{} as ExchangeRate]);
      const saveSpy = jest.spyOn(repository, 'save');

      await service.seedExchangeRates();

      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});
